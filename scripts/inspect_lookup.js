import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');

const regex = /(?:engDirectory|medDirectory|collegeMaster|masterDetails|engineeringColleges)[\s\S]{0,100}/gi;
let m;
let count = 0;
while ((m = regex.exec(mainJs)) !== null && count < 10) {
  console.log('Match:', m[0]);
  count++;
}
