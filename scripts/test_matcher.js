import fs from 'fs';

const adv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));

// Build dictionary from 2025 JoSAA data
const lines = fs.readFileSync('data/raw/josaa_2025_all_rounds_combined.csv', 'utf8').split('\n');
const dict = {}; // key: instShort + '||' + normBranch + '||' + cat + '||' + gender

function normInst(inst) {
  return inst
    .replace(/^Indian Institute of Technology\s+/i, 'IIT ')
    .replace(/^National Institute of Technology\s+/i, 'NIT ')
    .replace(/^Indian Institute of Information Technology\s+/i, 'IIIT ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normBranch(b) {
  return b
    .replace(/\s*\([^)]*\)/g, '') // remove (4 Years, Bachelor of Technology)
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function normGender(g) {
  if (g.toLowerCase().includes('female')) return 'Female-only (supernumerary)';
  return 'Gender-Neutral';
}

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  const round = parseInt(parts[1]);
  const inst = normInst(parts[3].replace(/"/g, ''));
  const prog = normBranch(parts[4].replace(/"/g, ''));
  const quota = parts[5].replace(/"/g, '').trim();
  const cat = parts[6].replace(/"/g, '').trim();
  const gen = normGender(parts[7].replace(/"/g, ''));
  const orank = parseInt(parts[8]) || 0;
  const crank = parseInt(parts[9]) || 0;

  const key = `${inst}||${prog}||${quota}||${cat}||${gen}`;
  if (!dict[key]) {
    dict[key] = {
      opening_2025: orank,
      closing_2025: crank,
      r1: null, r2: null, r3: null, r4: null, r5: null
    };
  }
  dict[key][`r${round}`] = crank;
  // Final closing rank is highest round available
  dict[key].closing_2025 = crank;
}

let matched = 0;
let unmatched = 0;

adv.forEach(item => {
  const inst = normInst(item.institute);
  const prog = normBranch(item.course);
  const quota = item.quota || 'AI';
  const cat = item.category;
  const gen = normGender(item.gender);

  const key = `${inst}||${prog}||${quota}||${cat}||${gen}`;
  if (dict[key]) {
    matched++;
  } else {
    // Try matching without quota or partial branch
    const partialKey = Object.keys(dict).find(k => k.startsWith(`${inst}||`) && k.includes(cat) && k.endsWith(gen) && (k.includes(item.shortBranch?.toLowerCase() || 'xyz')));
    if (partialKey) matched++;
    else unmatched++;
  }
});

console.log(`JEE Adv match results: matched ${matched} / ${adv.length} (${(matched/adv.length*100).toFixed(1)}%), unmatched ${unmatched}`);

