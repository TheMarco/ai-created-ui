/** Resolve the explicit root baseline used by the reviewed playground recipes. */
export function rootFontSizeFromCss(css) {
  const declaration = css.match(/\bhtml\s*\{[^}]*?\bfont-size:\s*([\d.]+)(%|px|rem)\s*;/);
  if (!declaration) throw new Error('The playground must declare its html font-size baseline.');
  const value = Number(declaration[1]);
  return declaration[2] === '%' ? value * 16 / 100 : declaration[2] === 'rem' ? value * 16 : value;
}

/** Convert source height/width pairs using Tailwind spacing and the root baseline. */
export function squareSizesFromSource(source, { spacing, rootFontPx }) {
  const sizes = new Set();
  const pair = /\bh-(\d+(?:\.\d+)?|px|\[(?:\d*\.)?\d+(?:px|rem)\])\s+w-\1(?![\w.-])/g;
  for (const match of source.matchAll(pair)) {
    const key = match[1];
    const value = key.startsWith('[') ? key.slice(1, -1) : spacing[key];
    if (typeof value !== 'string') continue;
    if (value.endsWith('rem')) sizes.add(Number.parseFloat(value) * rootFontPx);
    else if (value.endsWith('px')) sizes.add(Number.parseFloat(value));
  }
  return sizes;
}

export function squareClaims(text) {
  const claims = [];
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)\s*(?:×|x)\s*(\d+(?:\.\d+)?)\s*px/gu)) {
    if (Number(match[1]) === Number(match[2])) claims.push(Number(match[1]));
  }
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)px\s+square/gu)) claims.push(Number(match[1]));
  return claims;
}
