import fs from 'fs';

const adv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));

// Sample existing keys
const existingAdvKeys = new Set(adv.map(x => `${x.institute} || ${x.course} || ${x.category} || ${x.gender}`));
console.log('Existing adv combinations:', existingAdvKeys.size);

// Read 2025 combined CSV
const lines = fs.readFileSync('data/raw/josaa_2025_all_rounds_combined.csv', 'utf8').split('\n');
const iitRows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if (parts[2]?.replace(/"/g, '') === 'IIT') {
    iitRows.push({
      round: parseInt(parts[1]),
      institute: parts[3].replace(/"/g, '').trim(),
      program: parts[4].replace(/"/g, '').trim(),
      quota: parts[5].replace(/"/g, '').trim(),
      category: parts[6].replace(/"/g, '').trim(),
      gender: parts[7].replace(/"/g, '').trim(),
      orank: parseInt(parts[8]) || parts[8],
      crank: parseInt(parts[9]) || parts[9]
    });
  }
}

console.log('2025 IIT rows count:', iitRows.length);
const iitInsts = new Set(iitRows.map(r => r.institute));
console.log('2025 unique IIT institutes:', Array.from(iitInsts));

