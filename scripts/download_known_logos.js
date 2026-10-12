import fs from 'fs';
import path from 'path';
import https from 'https';

const LOGO_DIR = path.resolve('public/logos/colleges');
if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'MargDarshak/1.0 (https://margdarshak.org; contact@margdarshak.org) NodeJs/20' } }, (res) => {
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
    https.get(url, { headers: { 'User-Agent': 'MargDarshak/1.0 (https://margdarshak.org; contact@margdarshak.org) NodeJs/20' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // handle redirect
        file.close();
        https.get(res.headers.location, { headers: { 'User-Agent': 'MargDarshak/1.0 (https://margdarshak.org; contact@margdarshak.org) NodeJs/20' } }, (redirectRes) => {
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

// Known exact files on Wikimedia
const KNOWN_WIKI_FILES = {
  'MED-GMC-01': { file: 'File:Maulana Azad Medical College logo.svg', slug: 'mamc-delhi' },
  'MED-GMC-03': { file: 'File:JIPMER Logo.png', slug: 'jipmer-puducherry' },
  'MED-GMC-04': { file: 'File:Lady Hardinge Medical College logo.png', slug: 'lhmc-delhi' },
  'MED-GMC-05': { file: 'File:Logo gsmc my creation.png', slug: 'seth-gs-kem-mumbai' },
  'MED-GMC-06': { file: "File:King George's Medical University Logo.png", slug: 'kgmu-lucknow' },
  'MED-GMC-07': { file: 'File:Mmc-new.jpg', slug: 'mmc-chennai' },
  'MED-GMC-10': { file: 'File:Bangalore Medical College and Research Institute logo.png', slug: 'bmcri-bangalore' },
  'MED-PVT-01': { file: 'File:CMCH Vellore.JPG', slug: 'cmc-vellore' },
  'MED-PVT-02': { file: 'File:MAHE logo(1).svg', slug: 'kmc-manipal' },
  'MED-PVT-03': { file: "File:St. John's Medical College logo.png", slug: 'st-johns-bangalore' },
  'MED-PVT-05': { file: 'File:MAHE logo(1).svg', slug: 'kmc-mangalore' },
  'MED-PVT-06': { file: 'File:Logo of Symbiosis International University.svg', slug: 'smcw-symbiosis-pune' },
  'MED-PVT-08': { file: 'File:Amrita Vishwa Vidyapeetham - Logo.svg', slug: 'amrita-medicine-kochi' },
  'MED-MH-GMC-01': { file: 'File:B J Medical College, Pune.jpg', slug: 'bjmc-pune' },
  'MED-MH-GMC-02': { file: 'File:Government Medical College and Hospital, Nagpur (medical school) logo.png', slug: 'gmc-nagpur' },
  'MED-MH-GMC-05': { file: 'File:LTMMC logo big.jpg', slug: 'ltmmc-sion-mumbai' },
  'MED-MH-GMC-29': { file: 'File:AFMC Insignia (India).svg', slug: 'afmc-pune' },
  'MED-MH-PVT-04': { file: 'File:Bharati Vidyapeeth logo.png', slug: 'bharati-vidyapeeth-pune' },
  'MED-MH-PVT-22': { file: 'File:Bharati Vidyapeeth logo.png', slug: 'bharati-vidyapeeth-sangli' },
  'MED-AS-GMC-01': { file: 'File:GMCH emblem.jpg', slug: 'gmch-guwahati' },
  'MED-HP-GMC-01': { file: 'File:Indira Gandhi Medical College, Shimla Logo.png', slug: 'igmc-shimla' },
  'MED-GA-GMC-01': { file: 'File:Goa Medical College Logo.png', slug: 'gmc-goa' },
  'MED-HR-GMC-01': { file: 'File:Pandit Bhagwat Dayal Sharma Post Graduate Institute of Medical Sciences logo.png', slug: 'pgims-rohtak' }
};

async function main() {
  console.log('Downloading known high-priority medical college logos...');
  const results = {};

  for (const [id, item] of Object.entries(KNOWN_WIKI_FILES)) {
    console.log(`Processing ${id} (${item.slug})...`);
    const imgUrl = await getImageUrlFromFileTitle(item.file);
    if (!imgUrl) {
      console.log(`  Failed to get imageinfo for ${item.file}`);
      continue;
    }
    const ext = path.extname(new URL(imgUrl).pathname) || '.png';
    const filename = `${item.slug}${ext}`;
    const destPath = path.join(LOGO_DIR, filename);

    const success = await downloadImage(imgUrl, destPath);
    if (success) {
      const stats = fs.statSync(destPath);
      console.log(`  Downloaded: ${filename} (${stats.size} bytes)`);
      results[id] = `/logos/colleges/${filename}`;
    } else {
      console.log(`  Download failed for ${imgUrl}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync('public/data/college_logos_map.json', JSON.stringify(results, null, 2));
  console.log('Finished known files. Total saved:', Object.keys(results).length);
}

main().catch(console.error);
