import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Replace all remaining MargDarshak references in body content
html = html
  .replace(/how does MargDarshak estimate/g, 'how does NeetJeePredictor.in estimate')
  .replace(/MargDarshak correlates/g, 'NeetJeePredictor.in correlates')
  .replace(/MargDarshak's built-in/g, "NeetJeePredictor.in's built-in")
  .replace(/Why is MargDarshak 100% free/g, 'Why is NeetJeePredictor.in 100% free')
  .replace(/MargDarshak is engineered/g, 'NeetJeePredictor.in is engineered')
  .replace(/How MargDarshak Works & Counseling Guide/g, 'How NeetJeePredictor.in Works & Counseling Guide')
  .replace(/How MargDarshak Works \(Algorithm & Guide\)/g, 'How NeetJeePredictor.in Works (Algorithm & Guide)')
  .replace(/Student-Facing How MargDarshak Works/g, 'Student-Facing How NeetJeePredictor.in Works')
  .replace(/MargDarshak Pro/g, 'NeetJeePredictor.in Pro')
  .replace(/© 2026 MargDarshak \(v1\.0\.1\)/g, '© 2026 NeetJeePredictor.in')
  .replace(/<i class="bi bi-compass-fill text-primary"><\/i> MargDarshak/g, '<i class="bi bi-bullseye text-primary"></i> NeetJeePredictor.in')
  // catch-all for any leftover
  .replace(/MargDarshak/g, 'NeetJeePredictor.in');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! All remaining MargDarshak references replaced.');

