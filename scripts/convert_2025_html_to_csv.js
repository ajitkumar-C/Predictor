import fs from 'fs';
import path from 'path';

const roundFiles = [
  { round: 1, file: 'data/raw/2025_round_1.html', outCsv: 'data/raw/josaa_2025_round_1.csv' },
  { round: 2, file: 'data/raw/2025 round2.html', outCsv: 'data/raw/josaa_2025_round_2.csv' },
  { round: 3, file: 'data/raw/2025_round_3.html', outCsv: 'data/raw/josaa_2025_round_3.csv' },
  { round: 4, file: 'data/raw/2025_round_4.html', outCsv: 'data/raw/josaa_2025_round_4.csv' },
  { round: 5, file: 'data/raw/2025_round_5.html', outCsv: 'data/raw/josaa_2025_round_5.csv' }
];

function escapeCsv(val) {
  if (val == null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const allRoundsRecords = [];

for (const rf of roundFiles) {
  console.log(`Processing Round ${rf.round} from ${rf.file}...`);
  const content = fs.readFileSync(rf.file, 'utf8');
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

    // Determine institute type
    let type = 'GFTI';
    if (institute.toLowerCase().includes('indian institute of technology') || institute.toLowerCase().startsWith('iit ')) {
      type = 'IIT';
    } else if (institute.toLowerCase().includes('national institute of technology') || institute.toLowerCase().startsWith('nit ')) {
      type = 'NIT';
    } else if (institute.toLowerCase().includes('indian institute of information technology') || institute.toLowerCase().includes('iiit')) {
      type = 'IIIT';
    }

    const rec = {
      year: 2025,
      round: rf.round,
      type,
      institute,
      program,
      quota,
      category,
      gender,
      openingRank: orank,
      closingRank: crank
    };
    records.push(rec);
    allRoundsRecords.push(rec);
  }

  // Write round-specific CSV
  const csvLines = [
    'year,round,type,institute,program,quota,category,gender,opening_rank,closing_rank'
  ];
  for (const r of records) {
    csvLines.push([
      r.year,
      r.round,
      escapeCsv(r.type),
      escapeCsv(r.institute),
      escapeCsv(r.program),
      escapeCsv(r.quota),
      escapeCsv(r.category),
      escapeCsv(r.gender),
      r.openingRank,
      r.closingRank
    ].join(','));
  }
  fs.writeFileSync(rf.outCsv, csvLines.join('\n'), 'utf8');
  console.log(`Saved ${records.length} records to ${rf.outCsv}`);
}

// Write combined CSV
const combinedCsvLines = [
  'year,round,type,institute,program,quota,category,gender,opening_rank,closing_rank'
];
for (const r of allRoundsRecords) {
  combinedCsvLines.push([
    r.year,
    r.round,
    escapeCsv(r.type),
    escapeCsv(r.institute),
    escapeCsv(r.program),
    escapeCsv(r.quota),
    escapeCsv(r.category),
    escapeCsv(r.gender),
    r.openingRank,
    r.closingRank
  ].join(','));
}
fs.writeFileSync('data/raw/josaa_2025_all_rounds_combined.csv', combinedCsvLines.join('\n'), 'utf8');
console.log(`Saved all ${allRoundsRecords.length} records across 5 rounds to data/raw/josaa_2025_all_rounds_combined.csv!`);

