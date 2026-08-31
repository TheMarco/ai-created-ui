import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const sourcePath = path.join(packageRoot, 'styles/tokens.css');
const outputPath = path.join(
  packageRoot,
  'playground/public/design-system/tokens.json'
);
const extensionKey = 'org.ai-created.ui';
const accentAttribute = 'data-accent';
const defaultAccent = 'red';
const accentNames = [
  'red',
  'green',
  'blue',
  'orange',
  'yellow',
  'purple',
  'teal',
  'pink',
  'magenta',
];
const accentRoleScales = {
  dark: {
    accent: '400',
    accentHover: '500',
    actionPrimary: '700',
    actionPrimaryHover: '800',
    focus: '400',
  },
  light: {
    accent: '750',
    accentHover: '900',
    actionPrimary: '700',
    actionPrimaryHover: '800',
    focus: '750',
  },
};
const semanticAccentRoles = {
  accent: 'color-accent',
  accentHover: 'color-accent-hover',
  actionPrimary: 'color-action-primary',
  actionPrimaryHover: 'color-action-primary-hover',
  focus: 'color-focus',
};

function roundChannel(value) {
  return Number(value.toFixed(6));
}

function readDeclarations(css, selector) {
  const declarations = [];
  const blockPattern = /(^|\n)\s*([^\n{]+)\s*\{([\s\S]*?)\}/g;

  for (const match of css.matchAll(blockPattern)) {
    if (match[2].trim() !== selector) continue;

    const declarationPattern = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
    for (const declaration of match[3].matchAll(declarationPattern)) {
      declarations.push({
        name: declaration[1],
        value: declaration[2].trim(),
      });
    }
  }

  return declarations;
}

function declarationMap(declarations) {
  return new Map(declarations.map(({ name, value }) => [name, value]));
}

function expectAlias(declarations, name, target, context) {
  const expected = `var(--${target})`;
  const actual = declarations.get(name);

  if (actual !== expected) {
    throw new Error(
      `${context} must declare --${name}: ${expected}; received ${actual ?? 'no declaration'}.`
    );
  }
}

function createAccentMetadata(css, defaults, lightOverrides) {
  const defaultValues = declarationMap(defaults);
  const effectiveLightValues = new Map([
    ...defaultValues,
    ...lightOverrides,
  ]);
  const white = defaultValues.get('ref-white');

  if (!white || !parseHexColor(white)) {
    throw new Error('--ref-white must exist and contain a hex color for accent export.');
  }
  expectAlias(
    defaultValues,
    'color-on-action',
    'ref-white',
    'The default theme'
  );

  for (const [mode, roles] of Object.entries(accentRoleScales)) {
    const declarations = mode === 'dark' ? defaultValues : effectiveLightValues;

    for (const [role, scale] of Object.entries(roles)) {
      expectAlias(
        declarations,
        semanticAccentRoles[role],
        `ref-accent-current-${scale}`,
        `The ${mode} theme`
      );
    }
  }

  const accents = Object.fromEntries(
    accentNames.map((accent) => {
      const selector = accent === defaultAccent
        ? ':root'
        : `html[${accentAttribute}='${accent}']`;
      const selectorDeclarations = accent === defaultAccent
        ? defaults
        : readDeclarations(css, selector);

      if (selectorDeclarations.length === 0) {
        throw new Error(`Missing accent selector: ${selector}.`);
      }

      const selectorValues = declarationMap(selectorDeclarations);
      const requiredScales = new Set(
        Object.values(accentRoleScales).flatMap((roles) => Object.values(roles))
      );
      const references = new Map();

      for (const scale of requiredScales) {
        const referenceName = `ref-accent-${accent}-${scale}`;
        const referenceValue = defaultValues.get(referenceName);

        if (!referenceValue || !parseHexColor(referenceValue)) {
          throw new Error(
            `--${referenceName} must exist and contain a hex color for accent export.`
          );
        }

        expectAlias(
          selectorValues,
          `ref-accent-current-${scale}`,
          referenceName,
          `Accent selector ${selector}`
        );
        references.set(scale, referenceValue);
      }

      const roles = Object.fromEntries(
        Object.entries(accentRoleScales).map(([mode, scales]) => [
          mode,
          {
            ...Object.fromEntries(
              Object.entries(scales).map(([role, scale]) => [
                role,
                references.get(scale),
              ])
            ),
            onAction: white,
          },
        ])
      );

      return [accent, { selector, roles }];
    })
  );

  return {
    accentAttribute,
    defaultAccent,
    accents,
  };
}

function tokenPath(name, allNames) {
  const segments = name.split('-');
  const isAlsoGroup = allNames.some(
    (candidate) => candidate !== name && candidate.startsWith(`${name}-`)
  );

  return isAlsoGroup ? [...segments, '$root'] : segments;
}

function aliasPath(variableName, allNames) {
  return tokenPath(variableName, allNames).join('.');
}

function inferType(name, value) {
  if (
    name.startsWith('ref-') ||
    name.startsWith('color-') ||
    name.startsWith('hero-overlay-') ||
    name.startsWith('hero-text-')
  ) {
    return 'color';
  }

  if (name.startsWith('radius-') || name.startsWith('layout-')) {
    return 'dimension';
  }

  if (name.startsWith('motion-')) return 'duration';
  if (name.endsWith('-opacity')) return 'number';
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return 'number';
  if (/^-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em|vw|vh|%)$/i.test(value)) {
    return 'dimension';
  }
  if (/^-?(?:\d+\.?\d*|\.\d+)(?:ms|s)$/i.test(value)) return 'duration';
  if (/^(?:#|rgba?\(|hsla?\(|oklch\(|color\()/i.test(value)) return 'color';

  return 'string';
}

function parseHexColor(value) {
  const hex = value.slice(1);
  if (!/^[a-f\d]{3}(?:[a-f\d]{3})?(?:[a-f\d]{2})?$/i.test(hex)) return null;

  const expanded = hex.length === 3
    ? hex.split('').map((character) => character.repeat(2)).join('')
    : hex;
  const hasAlpha = expanded.length === 8;
  const channels = [0, 2, 4].map((offset) =>
    roundChannel(Number.parseInt(expanded.slice(offset, offset + 2), 16) / 255)
  );

  return {
    colorSpace: 'srgb',
    components: channels,
    alpha: hasAlpha
      ? roundChannel(Number.parseInt(expanded.slice(6, 8), 16) / 255)
      : 1,
  };
}

function parseRgbColor(value) {
  const match = value.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(\d+(?:\.\d+)?))?\s*\)$/i
  );
  if (!match) return null;

  return {
    colorSpace: 'srgb',
    components: match.slice(1, 4).map((channel) =>
      roundChannel(Number(channel) / 255)
    ),
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function transformValue(value, type, allNames) {
  const alias = value.match(/^var\(--([a-z0-9-]+)\)$/i);
  if (alias) return `{${aliasPath(alias[1], allNames)}}`;

  if (type === 'number') return Number(value);

  if (type === 'dimension' || type === 'duration') {
    const measurement = value.match(/^(-?(?:\d+\.?\d*|\.\d+))([a-z%]+)$/i);
    if (measurement) {
      return {
        value: Number(measurement[1]),
        unit: measurement[2].toLowerCase(),
      };
    }
  }

  if (type === 'color') {
    return parseHexColor(value) ?? parseRgbColor(value) ?? value;
  }

  return value;
}

function humanize(value) {
  const labels = {
    bg: 'background',
    lg: 'large',
    md: 'medium',
    red2: 'muted red',
    sm: 'small',
    surface2: 'secondary surface',
    text2: 'secondary text',
    text3: 'tertiary text',
  };

  return value
    .split('-')
    .map((part) => labels[part] ?? part)
    .join(' ');
}

function sentence(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function describe(name) {
  if (name.startsWith('ref-')) {
    return `Theme-invariant ${humanize(name.slice(4))} reference color.`;
  }
  if (name.startsWith('radius-')) {
    return `${sentence(humanize(name.slice(7)))} corner radius.`;
  }
  if (name.startsWith('layout-')) {
    return `${sentence(humanize(name.slice(7)))} layout measurement.`;
  }
  if (name.startsWith('motion-')) {
    return `${sentence(humanize(name.slice(7)))} interface motion duration.`;
  }
  if (name.startsWith('color-')) {
    return `Semantic color for ${humanize(name.slice(6))}.`;
  }
  if (name.startsWith('hero-')) {
    return `Hero ${humanize(name.slice(5))} value.`;
  }

  return `Design token exported from --${name}.`;
}

function setAtPath(root, segments, token) {
  let cursor = root;

  for (const segment of segments.slice(0, -1)) {
    cursor[segment] ??= {};
    cursor = cursor[segment];
  }

  cursor[segments.at(-1)] = token;
}

function createDocument(css) {
  const defaults = readDeclarations(css, ':root');
  const lightOverrides = declarationMap(readDeclarations(css, 'html.light'));
  const duplicateNames = defaults
    .map(({ name }) => name)
    .filter((name, index, names) => names.indexOf(name) !== index);

  if (duplicateNames.length > 0) {
    throw new Error(`Duplicate default tokens: ${[...new Set(duplicateNames)].join(', ')}`);
  }

  const allNames = defaults.map(({ name }) => name);
  const defaultNames = new Set(allNames);
  const unknownOverrides = [...lightOverrides.keys()].filter((name) => !defaultNames.has(name));
  if (unknownOverrides.length > 0) {
    throw new Error(`Light mode overrides unknown tokens: ${unknownOverrides.join(', ')}`);
  }

  const unknownAliases = [...defaults, ...readDeclarations(css, 'html.light')]
    .map(({ value }) => value.match(/^var\(--([a-z0-9-]+)\)$/i)?.[1])
    .filter((name) => name !== undefined && !defaultNames.has(name));
  if (unknownAliases.length > 0) {
    throw new Error(`Tokens contain unknown aliases: ${[...new Set(unknownAliases)].join(', ')}`);
  }

  const document = {
    $schema: 'https://tr.designtokens.org/format/',
    $description: 'AI-Created UI design tokens generated from styles/tokens.css.',
    $extensions: {
      [extensionKey]: {
        source: 'styles/tokens.css',
        defaultMode: 'dark',
        modes: {
          dark: { selector: ':root' },
          light: { selector: 'html.light' },
        },
        ...createAccentMetadata(css, defaults, lightOverrides),
      },
    },
  };

  for (const { name, value } of defaults) {
    const type = inferType(name, value);
    const lightValue = lightOverrides.get(name);
    const tokenExtension = {
      cssVariable: `--${name}`,
      cssValues: { dark: value },
    };

    if (lightValue !== undefined) {
      tokenExtension.cssValues.light = lightValue;
      tokenExtension.modeValues = {
        light: transformValue(lightValue, type, allNames),
      };
    }

    setAtPath(document, tokenPath(name, allNames), {
      $type: type,
      $value: transformValue(value, type, allNames),
      $description: describe(name),
      $extensions: {
        [extensionKey]: tokenExtension,
      },
    });
  }

  return document;
}

async function main() {
  const css = await readFile(sourcePath, 'utf8');
  const serialized = `${JSON.stringify(createDocument(css), null, 2)}\n`;
  const checkOnly = process.argv.includes('--check');

  if (checkOnly) {
    let committed;
    try {
      committed = await readFile(outputPath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(
          'Design token artifact is missing. Run `npm run tokens:export`.'
        );
      }
      throw error;
    }

    if (committed !== serialized) {
      throw new Error(
        'Design token artifact is stale. Run `npm run tokens:export`.'
      );
    }

    console.log('Design token artifact is current.');
    return;
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized, 'utf8');
  console.log(`Exported ${path.relative(packageRoot, outputPath)}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
