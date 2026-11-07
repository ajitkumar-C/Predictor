import fs from 'fs';

const jeeAdv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));
const jeeMain = JSON.parse(fs.readFileSync('data/jee_main.json', 'utf8'));

const advInstitutes = new Set(jeeAdv.map(x => x.institute));
const mainInstitutes = new Set(jeeMain.map(x => x.institute));

console.log('jee_adv unique institutes:', advInstitutes.size);
console.log('Sample jee_adv institutes:', Array.from(advInstitutes).slice(0, 5));

console.log('jee_main unique institutes:', mainInstitutes.size);
console.log('Sample jee_main institutes:', Array.from(mainInstitutes).slice(0, 5));

