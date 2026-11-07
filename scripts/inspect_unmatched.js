import fs from 'fs';

const adv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));
const lines = fs.readFileSync('data/raw/josaa_2025_all_rounds_combined.csv', 'utf8').split('\n');

function normInst(inst) {
  return inst
    .replace(/^Indian Institute of Technology\s+/i, 'IIT ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normBranch(b) {
  return b
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const josaaBranches = new Set();
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if (parts[2]?.replace(/"/g, '') === 'IIT') {
    josaaBranches.add(normBranch(parts[4].replace(/"/g, '')));
  }
}

console.log('Sample josaaBranches in IITs:');
console.log(Array.from(josaaBranches).slice(0, 15));

const sampleUnmatched = [];
adv.forEach(item => {
  const nb = normBranch(item.course);
  if (!josaaBranches.has(nb)) {
    sampleUnmatched.push(item.course);
  }
});
console.log('Unmatched course strings from jee_adv:', Array.from(new Set(sampleUnmatched)));

