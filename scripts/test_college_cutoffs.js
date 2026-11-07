import fs from 'fs';

const jeeAdv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));
const jeeMain = JSON.parse(fs.readFileSync('data/jee_main.json', 'utf8'));
const neetUg = JSON.parse(fs.readFileSync('data/neet_ug.json', 'utf8'));
const engColleges = JSON.parse(fs.readFileSync('data/engineering_colleges_directory.json', 'utf8'));
const medColleges = JSON.parse(fs.readFileSync('data/medical_colleges_directory.json', 'utf8'));

function findCutoffsForCollege(col) {
  const allData = [...jeeAdv, ...jeeMain, ...neetUg];
  const qName = (col.short || col.shortName || col.name || '').toLowerCase();
  const qCity = (col.city || '').toLowerCase();

  return allData.filter(item => {
    const iName = (item.institute || '').toLowerCase();
    return iName.includes(qName) || qName.includes(iName) || (qCity && iName.includes(qCity) && (col.type === item.type));
  });
}

// Test for IIT Bombay
const iitb = engColleges.find(c => c.name.includes('Bombay'));
const resIITB = findCutoffsForCollege(iitb);
console.log('IIT Bombay cutoffs found:', resIITB.length);
const branchesIITB = new Set(resIITB.map(r => r.course));
console.log('IIT Bombay branches:', Array.from(branchesIITB));

// Test for AIIMS Delhi
const aiimsD = medColleges.find(c => c.name.includes('Delhi'));
const resAiimsD = findCutoffsForCollege(aiimsD);
console.log('AIIMS Delhi cutoffs found:', resAiimsD.length);
const branchesAiimsD = new Set(resAiimsD.map(r => r.course));
console.log('AIIMS Delhi branches:', Array.from(branchesAiimsD));

