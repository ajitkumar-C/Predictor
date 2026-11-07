import fs from 'fs';

const engColleges = JSON.parse(fs.readFileSync('data/engineering_colleges_directory.json', 'utf8'));
console.log('engineering_colleges_directory count:', engColleges.length);
console.log('Sample engineering college:', engColleges[0]);

