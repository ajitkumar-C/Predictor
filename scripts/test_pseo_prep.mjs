import fs from 'fs';
import path from 'path';

// Load data files
const medDir = JSON.parse(fs.readFileSync('public/data/medical_colleges_directory.json', 'utf8'));
const engDir = JSON.parse(fs.readFileSync('public/data/engineering_colleges_directory.json', 'utf8'));
const master = JSON.parse(fs.readFileSync('public/data/college_master_details.json', 'utf8'));
const neetUg = JSON.parse(fs.readFileSync('public/data/neet_ug.json', 'utf8'));
const jeeMain = JSON.parse(fs.readFileSync('public/data/jee_main.json', 'utf8'));
const jeeAdv = JSON.parse(fs.readFileSync('public/data/jee_adv.json', 'utf8'));

// Slugify helper
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

console.log('Loaded datasets successfully!');
console.log(`Med: ${medDir.length}, Eng: ${engDir.length}, Master: ${Object.keys(master).length}`);
