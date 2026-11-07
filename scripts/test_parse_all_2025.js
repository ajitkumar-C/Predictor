import fs from 'fs';
import path from 'path';

function parseRoundHtml(filePath) {
  console.log(`Parsing ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf8');

  // Match each <tr>...</tr> in tbody (excluding header)
  const rowRegex = /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>[\s\S]*?_lblBranch">([\s\S]*?)<\/span>[\s\S]*?_lblQuota">([\s\S]*?)<\/span>[\s\S]*?_lblCategory">([\s\S]*?)<\/span>[\s\S]*?_lblGender">([\s\S]*?)<\/span>[\s\S]*?_lblOpenRank">([\s\S]*?)<\/span>[\s\S]*?_lblCloseRank">([\s\S]*?)<\/span>[\s\S]*?<\/tr>/gi;

  const records = [];
  let match;
  while ((match = rowRegex.exec(content)) !== null) {
    const institute = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const program = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const quota = match[3].replace(/<[^>]+>/g, '').trim();
    const category = match[4].replace(/<[^>]+>/g, '').trim();
    const gender = match[5].replace(/<[^>]+>/g, '').trim();
    const orank = match[6].replace(/<[^>]+>/g, '').trim();
    const crank = match[7].replace(/<[^>]+>/g, '').trim();

    records.push({
      institute,
      program,
      quota,
      category,
      gender,
      orank,
      crank
    });
  }

  console.log(`Parsed ${records.length} records from ${path.basename(filePath)}`);
  if (records.length > 0) {
    console.log('Sample record 0:', records[0]);
    console.log('Sample record last:', records[records.length - 1]);
  }
  return records;
}

const rounds = [
  'data/raw/2025_round_1.html',
  'data/raw/2025 round2.html',
  'data/raw/2025_round_3.html',
  'data/raw/2025_round_4.html',
  'data/raw/2025_round_5.html'
];

rounds.forEach(r => {
  if (fs.existsSync(r)) {
    parseRoundHtml(r);
  } else {
    console.log(`File not found: ${r}`);
  }
});

