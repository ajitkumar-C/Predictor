import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Update title
html = html.replace(
  /MargDarshak — Cutoff Predictor 2026 \| Free College Predictor for JEE Main, NEET UG, JEE Advanced & NEET PG/,
  'NeetJeePredictor.in — Free NEET JEE Cutoff Predictor 2026 | AIIMS, IIT, NIT, GMC College Predictor'
);

// Update author meta
html = html.replace('content="MargDarshak - NEET JEE Predictor"', 'content="NeetJeePredictor.in"');

// Update OG site name
html = html.replace('content="MargDarshak | NEET JEE Predictor"', 'content="NeetJeePredictor.in"');

// Update OG title
html = html.replace(
  'content="MargDarshak — NEET JEE Predictor 2026 | Free College Predictor"',
  'content="NeetJeePredictor.in — Free NEET JEE College Predictor 2026"'
);

// Update Twitter title
html = html.replace(
  'content="MargDarshak — NEET JEE Predictor 2026 | Free College Predictor"',
  'content="NeetJeePredictor.in — Free NEET JEE College Predictor 2026"'
);

// Update JSON-LD app name
html = html.replace('"name": "MargDarshak NEET JEE Predictor 2026"', '"name": "NeetJeePredictor.in — Free NEET JEE Cutoff Predictor 2026"');

// Update JSON-LD organization names
html = html.replace(/"name": "MargDarshak Education"/g, '"name": "NeetJeePredictor.in"');

// Update remaining MargDarshak references in FAQ text  
html = html.replace(/MargDarshak's/g, "NeetJeePredictor.in's");
html = html.replace(/MargDarshak includes/g, 'NeetJeePredictor.in includes');
html = html.replace(/MargDarshak is completely free/g, 'NeetJeePredictor.in is completely free');
html = html.replace(/on MargDarshak to/g, 'on NeetJeePredictor.in to');
html = html.replace(/"What is a Cutoff Predictor and how does MargDarshak predict/, '"What is a Cutoff Predictor and how does NeetJeePredictor.in predict');
html = html.replace(/"Is MargDarshak Cutoff Predictor/, '"Is NeetJeePredictor.in Cutoff Predictor');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! All MargDarshak references updated.');

