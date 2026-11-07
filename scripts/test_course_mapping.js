import fs from 'fs';

const adv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));
const existingCourses = new Set(adv.map(x => x.course));

const lines = fs.readFileSync('data/raw/josaa_2025_all_rounds_combined.csv', 'utf8').split('\n');
const iitPrograms = new Set();
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if (parts[2]?.replace(/"/g, '') === 'IIT') {
    iitPrograms.add(parts[4].replace(/"/g, '').trim());
  }
}

console.log('Existing JEE Adv courses:', Array.from(existingCourses));
console.log('Sample 2025 IIT programs:', Array.from(iitPrograms).slice(0, 10));

