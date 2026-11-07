import fs from 'fs';

const jeeAdv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));
const jeeMain = JSON.parse(fs.readFileSync('data/jee_main.json', 'utf8'));
const neetUg = JSON.parse(fs.readFileSync('data/neet_ug.json', 'utf8'));

function testCutoffMatrix(collegeName, examKey) {
  let dataset = jeeAdv;
  if (examKey === 'JEE-MAIN') dataset = jeeMain;
  if (examKey === 'NEET-UG') dataset = neetUg;

  const q = collegeName.toLowerCase();
  const collegeRecords = dataset.filter(r => {
    const inst = (r.institute || '').toLowerCase();
    return inst.includes(q) || q.includes(inst);
  });

  console.log(`\n=== Testing ${collegeName} (${examKey}): ${collegeRecords.length} records ===`);
  const branches = Array.from(new Set(collegeRecords.map(r => r.course || r.shortBranch)));
  console.log('Available branches:', branches);

  const selectedBranch = branches[0];
  const branchRecords = collegeRecords.filter(r => (r.course || r.shortBranch) === selectedBranch);

  const categories = ['OPEN', 'EWS', 'OBC-NCL', 'SC', 'ST', 'PwD'];
  const pool = 'Gender-Neutral';

  const rows = [];
  categories.forEach(cat => {
    const rec = branchRecords.find(r => r.category === cat && (!r.gender || r.gender === pool));
    if (rec) {
      const c25 = rec.closing_2025 || rec.closing_2024;
      const c24 = rec.closing_2024;
      const c23 = rec.closing_2023 || Math.round(c24 * 0.95);
      const c22 = rec.closing_2022 || Math.round(c24 * 0.90);
      const shift = (((c25 - c24) / c24) * 100).toFixed(1);
      rows.push({
        category: cat,
        year2025: c25,
        year2024: c24,
        year2023: c23,
        year2022: c22,
        shift: `${shift > 0 ? '+' : ''}${shift}%`
      });
    }
  });

  console.table(rows);
}

testCutoffMatrix('IIT Bombay', 'JEE-ADVANCED');
testCutoffMatrix('NIT Tiruchirappalli', 'JEE-MAIN');
testCutoffMatrix('AIIMS New Delhi', 'NEET-UG');

