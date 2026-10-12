import fs from 'fs';
import path from 'path';
import https from 'https';

const LOGO_DIR = path.resolve('public/logos/colleges');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'MargDarshak/1.0 (contact@margdarshak.org) NodeJs/20' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'MargDarshak/1.0 (contact@margdarshak.org) NodeJs/20' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        https.get(res.headers.location, { headers: { 'User-Agent': 'MargDarshak/1.0 (contact@margdarshak.org) NodeJs/20' } }, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => { fs.unlink(destPath, () => {}); resolve(false); });
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', () => { fs.unlink(destPath, () => {}); resolve(false); });
  });
}

async function getImageUrlFromFileTitle(fileTitle) {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(fileTitle) + '&prop=imageinfo&iiprop=url&format=json';
  const res = await fetchJson(url);
  const pages = res?.query?.pages || {};
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

const BATCH_3 = {
  'MED-GMC-12': { file: 'File:Rajasthan University of Health Sciences logo.png', slug: 'sms-ruhs-jaipur' },
  'AMRU-HP': { file: 'File:Atal Medical and Research University Logo.png', slug: 'amru-himachal' },
  'MED-GMC-11': { file: 'File:JJ Hospital.jpg', slug: 'grant-gmc-mumbai' },
  'MED-AP-GMC-01': { file: 'File:Andhra Medical College & Hospital in Vishakhapatnam 04.jpg', slug: 'amc-visakhapatnam' },
  'MED-HR-GMC-03': { file: 'File:KCGMCentrygate.jpg', slug: 'kcgmc-karnal' }
};

async function main() {
  console.log('Downloading Batch 3 logos...');
  let mapData = {};
  if (fs.existsSync('public/data/college_logos_map.json')) {
    mapData = JSON.parse(fs.readFileSync('public/data/college_logos_map.json', 'utf8'));
  }

  for (const [id, item] of Object.entries(BATCH_3)) {
    const imgUrl = await getImageUrlFromFileTitle(item.file);
    if (!imgUrl) continue;
    const ext = path.extname(new URL(imgUrl).pathname) || '.png';
    const filename = `${item.slug}${ext}`;
    const destPath = path.join(LOGO_DIR, filename);

    const success = await downloadImage(imgUrl, destPath);
    if (success) {
      console.log(`  Downloaded: ${filename}`);
      mapData[id] = `/logos/colleges/${filename}`;
    }
    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync('public/data/college_logos_map.json', JSON.stringify(mapData, null, 2));
}

main().catch(console.error);
