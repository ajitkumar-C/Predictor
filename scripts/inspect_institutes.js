import fs from 'fs';

const files = [
  'data/raw/2025_round_1.html',
  'data/raw/2025 round2.html',
  'data/raw/2025_round_3.html',
  'data/raw/2025_round_4.html',
  'data/raw/2025_round_5.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const rowRegex = /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>[\s\S]*?_lblBranch">([\s\S]*?)<\/span>/gi;
  const set = new Set();
  let m;
  while ((m = rowRegex.exec(content)) !== null) {
    set.add(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  }
  console.log(`${f} -> ${set.size} unique institutes`);
});
