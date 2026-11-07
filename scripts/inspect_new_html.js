import fs from 'fs';

const filePath = 'data/raw/2025_round_1.html';
const fd = fs.openSync(filePath, 'r');
const buffer = Buffer.alloc(20000);
fs.readSync(fd, buffer, 0, 20000, 0);
fs.closeSync(fd);

const text = buffer.toString('utf8');
const firstRowEnd = text.indexOf('</tr>', text.indexOf('<tr class="bg-secondary'));
const secondRowEnd = text.indexOf('</tr>', firstRowEnd + 5);
console.log('Row 1 full HTML:');
console.log(text.substring(firstRowEnd, secondRowEnd + 5));
