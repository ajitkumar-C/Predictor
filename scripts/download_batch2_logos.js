import fs from 'fs';
import path from 'path';
import https from 'https';

const LOGO_DIR = path.resolve('public/logos/colleges');
if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

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

const BATCH_2 = {
  'MED-GMC-02': { file: 'File:Vardhman Mahavir Medical College logo.svg', slug: 'vmmc-delhi' },
  'MED-PVT-04': { file: 'File:Jamia Hamdard Logo.svg', slug: 'jamia-hamdard-delhi' },
  'MED-MH-PVT-06': { file: 'File:Mgims logo.png', slug: 'mgims-sevagram' },
  'MED-MH-PVT-08': { file: 'File:MGM Institute of Health Sciences Logo.png', slug: 'mgm-navi-mumbai' },
  'MED-MH-PVT-09': { file: 'File:MGM Institute of Health Sciences Logo.png', slug: 'mgm-aurangabad' },
  'MED-MH-PVT-12': { file: 'File:Krishna Institute of Medical Sciences Logo.png', slug: 'kims-karad' },
  'MED-MH-PVT-13': { file: 'File:Pravara Institute of Medical Sciences Logo.png', slug: 'pravara-loni' },
  'MED-MH-GMC-08': { file: 'File:Government Medical College, Aurangabad logo.png', slug: 'gmc-aurangabad' },
  'MED-MH-GMC-09': { file: 'File:Gmc miraj logo.jpg', slug: 'gmc-miraj' },
  'MED-MH-PVT-10': { file: 'File:Kjsomiya4.png', slug: 'kj-somaiya-mumbai' },
  'MED-AS-GMC-02': { file: 'File:Assam Medical College Logo.jpg', slug: 'assam-medical-college' },
  'MUHS-MAHARASHTRA': { file: 'File:Maharashtra University of Health Sciences logo(2).svg', slug: 'muhs-nashik' }
};

async function main() {
  console.log('Downloading Batch 2 medical college logos...');
  let mapData = {};
  if (fs.existsSync('public/data/college_logos_map.json')) {
    mapData = JSON.parse(fs.readFileSync('public/data/college_logos_map.json', 'utf8'));
  }

  for (const [id, item] of Object.entries(BATCH_2)) {
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
      mapData[id] = `/logos/colleges/${filename}`;
    } else {
      console.log(`  Download failed for ${imgUrl}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync('public/data/college_logos_map.json', JSON.stringify(mapData, null, 2));
  console.log('Batch 2 done. Total registered logos:', Object.keys(mapData).length);
}

main().catch(console.error);
