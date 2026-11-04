// Copies partials/*.html into every page between marker comments:
//   <!-- partial:header -->  ...  <!-- /partial:header -->
// Run from the repo root after editing a partial:  node tools/sync-partials.mjs
// Pages without markers (privacy-*.html, support-mochisensei.html, admin.html) are left untouched.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const names = ['head', 'header', 'footer'];
const partials = Object.fromEntries(
  names.map((n) => [n, readFileSync(join(root, 'partials', `${n}.html`), 'utf8').trimEnd()])
);

let changed = 0;
for (const file of readdirSync(root).filter((f) => f.endsWith('.html'))) {
  const path = join(root, file);
  const src = readFileSync(path, 'utf8');
  let out = src;
  for (const n of names) {
    const re = new RegExp(`(<!-- partial:${n} -->)[\\s\\S]*?(<!-- /partial:${n} -->)`, 'g');
    out = out.replace(re, `$1\n${partials[n]}\n$2`);
  }
  if (out !== src) {
    writeFileSync(path, out);
    changed++;
    console.log(`updated ${file}`);
  }
}
console.log(`${changed} file(s) updated`);
