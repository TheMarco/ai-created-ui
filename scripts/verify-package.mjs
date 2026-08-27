import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const cacheDirectory = await mkdtemp(path.join(tmpdir(), 'ai-created-ui-npm-'));

try {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(
    npmCommand,
    ['pack', '--dry-run', '--json', '--ignore-scripts', '--cache', cacheDirectory],
    {
      cwd: packageRoot,
      encoding: 'utf8',
    }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || 'npm pack --dry-run failed');
  }

  const [pack] = JSON.parse(result.stdout);
  const filePaths = pack.files.map((file) => file.path);
  const requiredFiles = [
    'package.json',
    'src/index.ts',
    'styles/tokens.css',
    'tailwind-preset.js',
  ];

  const missingFiles = requiredFiles.filter((file) => !filePaths.includes(file));
  if (missingFiles.length > 0) {
    throw new Error(`Package is missing required files: ${missingFiles.join(', ')}`);
  }

  const allowedRootFiles = new Set([
    'LICENSE',
    'LICENSE.md',
    'README',
    'README.md',
    'package.json',
    'tailwind-preset.js',
  ]);
  const unexpectedFiles = filePaths.filter(
    (file) =>
      !allowedRootFiles.has(file) &&
      !file.startsWith('src/') &&
      !file.startsWith('styles/')
  );

  if (unexpectedFiles.length > 0) {
    throw new Error(
      `Package contains files outside the public boundary: ${unexpectedFiles.join(', ')}`
    );
  }

  console.log(
    `Package boundary verified: ${pack.name}@${pack.version}, ${filePaths.length} files, ${pack.size} bytes.`
  );
} finally {
  await rm(cacheDirectory, { recursive: true, force: true });
}
