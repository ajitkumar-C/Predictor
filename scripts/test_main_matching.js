import fs from 'fs';

const main = JSON.parse(fs.readFileSync('data/jee_main.json', 'utf8'));
const lines = fs.readFileSync('data/raw/josaa_2025_all_rounds_combined.csv', 'utf8').split('\n');

function normInst(inst) {
  return inst
    .replace(/^National Institute of Technology\s+/i, 'NIT ')
    .replace(/^Indian Institute of Information Technology\s+/i, 'IIIT ')
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('Total jee_main items:', main.length);
const mainInsts = new Set(main.map(m => normInst(m.institute)));
console.log('Unique jee_main institutes:', Array.from(mainInsts).slice(0, 10));

