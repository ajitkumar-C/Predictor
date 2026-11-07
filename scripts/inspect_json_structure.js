import fs from 'fs';

const jeeAdv = JSON.parse(fs.readFileSync('data/jee_adv.json', 'utf8'));
const jeeMain = JSON.parse(fs.readFileSync('data/jee_main.json', 'utf8'));

console.log('jee_adv sample:');
console.log(jeeAdv[0]);

console.log('jee_main sample:');
console.log(jeeMain[0]);

