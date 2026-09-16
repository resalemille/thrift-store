import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

export function updateCache(cache, build, number) {
  mkdirSync(cache, { recursive: true });
  if (number !== undefined && !/^[1-9]\d*$/.test(String(number))) throw new Error('Invalid PR number');
  const target = number === undefined ? cache : join(cache, 'pr-preview', `pr-${number}`);
  if (build && (!existsSync(join(build, 'index.html')) || existsSync(join(build, 'pr-preview')))) {
    throw new Error('Build must contain index.html and must not contain reserved pr-preview directory');
  }
  if (number === undefined) {
    if (!build) throw new Error('Production build required');
    for (const name of readdirSync(cache)) {
      if (!['.git', 'pr-preview'].includes(name)) rmSync(join(cache, name), { recursive: true, force: true });
    }
  } else {
    rmSync(target, { recursive: true, force: true });
  }
  if (build) {
    mkdirSync(target, { recursive: true });
    for (const name of readdirSync(build)) {
      if (name === '.git' || (number !== undefined && name === 'CNAME')) continue;
      cpSync(join(build, name), join(target, name), { recursive: true });
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [cache, build, number] = process.argv.slice(2);
  updateCache(cache, build === '-' ? undefined : build, number);
}
