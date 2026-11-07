import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const lines = mainJs.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('closing_2024')) {
    console.log(`${idx + 1}: ${l.trim().substring(0, 100)}`);
  }
});

