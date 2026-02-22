import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pug from 'pug';

const src = dirname(fileURLToPath(import.meta.url));
const dist = resolve(src, '..', 'dist');

mkdirSync(dist, { recursive: true });
const compiled = pug.compileFileClient(resolve(src, 'template.pug'), { compileDebug: false });
writeFileSync(resolve(dist, 'template.mjs'), compiled + '\nexport{template}');
copyFileSync(resolve(src, 'index.mjs'), resolve(dist, 'index.mjs'));
