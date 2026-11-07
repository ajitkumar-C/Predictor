import fs from 'fs';
import readline from 'readline';

async function processLineByLine() {
  const fileStream = fs.createReadStream('data/raw/josaa-2024-r5.csv');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let header = null;
  const types = {};
  let count = 0;

  for await (const line of rl) {
    if (!header) { header = line; continue; }
    count++;
    // Simple CSV parser for quoted fields
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (parts.length >= 10) {
      const type = parts[2].replace(/"/g, '').trim();
      types[type] = (types[type] || 0) + 1;
    }
  }
  console.log('Total 2024 rows:', count);
  console.log('Institutes by type:', types);
}

processLineByLine();
