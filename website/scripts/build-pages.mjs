import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('..', import.meta.url));
const vinextCli = join(siteRoot, 'node_modules', 'vinext', 'dist', 'cli.js');
const result = spawnSync(process.execPath, [vinextCli, 'build'], {
  cwd: siteRoot,
  env: { ...process.env, GITHUB_PAGES: 'true', PAGES_BASE_PATH: '' },
  stdio: 'inherit',
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const sourceDirectory = resolve(siteRoot, 'dist', 'client');
const outputDirectory = resolve(siteRoot, 'pages-dist');
if (!outputDirectory.startsWith(`${resolve(siteRoot)}\\`) && !outputDirectory.startsWith(`${resolve(siteRoot)}/`)) {
  throw new Error('Refusing to write the Pages output outside the website directory.');
}

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(dirname(outputDirectory), { recursive: true });
cpSync(sourceDirectory, outputDirectory, { recursive: true });

const trimmedBasePath = (process.env.PAGES_BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
const basePath = trimmedBasePath ? `/${trimmedBasePath}` : '';
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.rsc', '.txt']);

function rewriteAssetPaths(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      rewriteAssetPaths(path);
      continue;
    }
    if (!textExtensions.has(extname(entry)) && !['.assetsignore', '_headers'].includes(entry)) continue;
    const original = readFileSync(path, 'utf8');
    const rewritten = original
      .replaceAll('/_next/', `${basePath}/_next/`)
      .replaceAll('/media/', `${basePath}/media/`);
    if (rewritten !== original) writeFileSync(path, rewritten);
  }
}

rewriteAssetPaths(outputDirectory);
console.log(`GitHub Pages output ready: ${outputDirectory}${basePath ? ` (base path ${basePath})` : ''}`);
