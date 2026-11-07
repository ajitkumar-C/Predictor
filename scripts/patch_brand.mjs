import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update brand icon
html = html.replace(
  '<i class="bi bi-compass-fill"></i>',
  '<i class="bi bi-bullseye"></i>'
);

// 2. Update brand name - remove MargDarshak, add NeetJeePredictor.in
html = html.replace(
  /MargDarshak\s+<span class="badge-beta">100% FREE<\/span>[\s\S]*?<\/div>\r?\n(\s+<div class="brand-tagline">)AIIMS[^<]+<\/div>/,
  'NeetJeePredictor<span style="color:#f97316;">.in</span> <span class="badge-beta">100% FREE</span></div>\n$1NEET UG • JEE Main • JEE Advanced • NEET PG Cutoff Predictor</div>'
);

// 3. Reorder nav: Predictor → PYQ/MCQs → Medical → Engineering
// Extract nav buttons
const predictorBtn = html.match(/(<button class="nav-menu-link active" data-page="page-predictor"[\s\S]*?<\/button>)/)?.[1];
const medBtn = html.match(/(<button class="nav-menu-link" data-page="page-medical-directory"[\s\S]*?<\/button>)/)?.[1];
const engBtn = html.match(/(<button class="nav-menu-link" data-page="page-engineering-directory"[\s\S]*?<\/button>)/)?.[1];
const mcqBtn = html.match(/(<button class="nav-menu-link" data-page="page-mcq-practice"[\s\S]*?<\/button>)/)?.[1];

console.log('predictor found:', !!predictorBtn);
console.log('med found:', !!medBtn);
console.log('eng found:', !!engBtn);
console.log('mcq found:', !!mcqBtn);

// Replace the full nav content
const navRegex = /(<nav class="main-nav-menu" id="main-nav-menu">)([\s\S]*?)(<\/nav>)/;
html = html.replace(navRegex, (_, open, _inner, close) => {
  const indent = '        ';
  return `${open}
${indent}${predictorBtn}
${indent}${mcqBtn}
${indent}${medBtn}
${indent}${engBtn}
      ${close}`;
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');

