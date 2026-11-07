import fs from 'fs';

const gtmHead = `  <!-- Google Tag Manager -->
  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-WKNCXJ2Z"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  </script>
  <!-- End Google Tag Manager -->`;

const gtmBody = `  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WKNCXJ2Z"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;

const files = ['contact-us.html', 'privacy-policy.html', 'terms-and-conditions.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes('GTM-WKNCXJ2Z')) {
    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n${gtmHead}`
    );
    html = html.replace('<body>', `<body>\n${gtmBody}`);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Added GTM to ${file}`);
  }
}
