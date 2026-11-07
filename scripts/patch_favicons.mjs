import fs from 'fs';

const files = ['contact-us.html', 'privacy-policy.html', 'terms-and-conditions.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  
  // Add favicon if not present
  if (!html.includes('rel="icon"')) {
    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <link rel="icon" type="image/svg+xml" href="/favicon.svg">\n  <link rel="alternate icon" href="/favicon.svg">\n  <link rel="apple-touch-icon" href="/favicon.svg">'
    );
  }
  
  // Update brand references
  html = html.replace(/MargDarshak/g, 'NeetJeePredictor.in');
  
  fs.writeFileSync(file, html, 'utf8');
  console.log(`Updated ${file}`);
}
