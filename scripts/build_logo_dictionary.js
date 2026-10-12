import fs from 'fs';

const directory = JSON.parse(fs.readFileSync('public/data/medical_colleges_directory.json', 'utf8'));
const map = JSON.parse(fs.readFileSync('public/data/college_logos_map.json', 'utf8'));

const aiimsLogos = {
  'delhi': '/logos/aiims/aiims-delhi.svg',
  'new delhi': '/logos/aiims/aiims-delhi.svg',
  'bhopal': '/logos/aiims/aiims-bhopal.png',
  'bhubaneswar': '/logos/aiims/aiims-bhubaneswar.png',
  'jodhpur': '/logos/aiims/aiims-jodhpur.png',
  'rishikesh': '/logos/aiims/aiims-rishikesh.svg',
  'raipur': '/logos/aiims/aiims-raipur.png',
  'patna': '/logos/aiims/aiims-patna.png',
  'nagpur': '/logos/aiims/aiims-nagpur.png',
  'kalyani': '/logos/aiims/aiims-kalyani.svg',
  'mangalagiri': '/logos/aiims/aiims-mangalagiri.png',
  'gorakhpur': '/logos/aiims/aiims-gorakhpur.png',
  'bathinda': '/logos/aiims/aiims-bathinda.png',
  'bibinagar': '/logos/aiims/aiims-bibinagar.png',
  'bilaspur': '/logos/aiims/aiims-bilaspur.png',
  'guwahati': '/logos/aiims/aiims-guwahati.png',
  'deoghar': '/logos/aiims/aiims-deoghar.png',
  'rajkot': '/logos/aiims/aiims-rajkot.png',
  'raebareli': '/logos/aiims/aiims-raebareli.png',
  'rae bareli': '/logos/aiims/aiims-raebareli.png'
};

const byId = {};
const byName = {};
const keywords = [];

// 1. Directory colleges
for (const c of directory) {
  let logo = c.logo;
  if (!logo) {
    if (c.type === 'AIIMS' || c.name.startsWith('AIIMS')) {
      const lower = c.name.toLowerCase();
      for (const [k, p] of Object.entries(aiimsLogos)) {
        if (lower.includes(k)) { logo = p; break; }
      }
      if (!logo) logo = '/logos/aiims/aiims-delhi.svg';
    } else if (map[c.id]) {
      logo = map[c.id];
    }
  }

  if (logo) {
    byId[c.id] = logo;
    byName[c.name.toLowerCase().trim()] = logo;
    if (c.short) byName[c.short.toLowerCase().trim()] = logo;

    // Distinctive keywords
    const clean = c.name.toLowerCase()
      .replace(/government medical college/gi, '')
      .replace(/medical college/gi, '')
      .replace(/general hospital/gi, '')
      .replace(/hospital/gi, '')
      .replace(/institutes?/gi, '')
      .replace(/research centres?/gi, '')
      .replace(/deemed to be university/gi, '')
      .replace(/university/gi, '')
      .replace(/and/gi, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .trim();

    const parts = clean.split(/\s+/).filter(w => w.length >= 4);
    for (const p of parts) {
      if (!['govt', 'state', 'pune', 'delhi', 'mumbai'].includes(p)) {
        keywords.push({ kw: p, logo });
      }
    }
  }
}

// Special alias rules for NEET UG Predictor
const specialAliases = {
  'vmmc & safdarjung hospital': '/logos/colleges/vmmc-delhi.svg',
  'vmmc': '/logos/colleges/vmmc-delhi.svg',
  'safdarjung': '/logos/colleges/vmmc-delhi.svg',
  'maulana azad': '/logos/colleges/mamc-delhi.svg',
  'mamc': '/logos/colleges/mamc-delhi.svg',
  'kem hospital': '/logos/colleges/seth-gs-kem-mumbai.png',
  'seth gs': '/logos/colleges/seth-gs-kem-mumbai.png',
  'grant medical': '/logos/colleges/grant-gmc-mumbai.jpg',
  'grant govt': '/logos/colleges/grant-gmc-mumbai.jpg',
  'jj hospital': '/logos/colleges/grant-gmc-mumbai.jpg',
  'gmc amritsar': '/logos/colleges/gmc-amritsar.svg',
  'gmc srinagar': '/logos/colleges/gmc-srinagar.svg',
  'bjmc pune': '/logos/colleges/bjmc-pune.jpg',
  'sassoon': '/logos/colleges/bjmc-pune.jpg',
  'sion hospital': '/logos/colleges/ltmmc-sion-mumbai.jpg',
  'ltmmc': '/logos/colleges/ltmmc-sion-mumbai.jpg',
  'nair hospital': '/logos/colleges/gmc-maroon.svg',
  'tnmc': '/logos/colleges/gmc-maroon.svg',
  'cooper hospital': '/logos/colleges/gmc-maroon.svg',
  'hbt medical': '/logos/colleges/gmc-maroon.svg',
  'afmc': '/logos/colleges/afmc-pune.svg',
  'cmc vellore': '/logos/colleges/cmc-vellore.JPG',
  'kmc manipal': '/logos/colleges/kmc-manipal.svg',
  'kmc mangalore': '/logos/colleges/kmc-mangalore.svg',
  'st john': '/logos/colleges/st-johns-bangalore.png',
  'kgmu': '/logos/colleges/kgmu-lucknow.png',
  'king george': '/logos/colleges/kgmu-lucknow.png',
  'jipmer': '/logos/colleges/jipmer-puducherry.png',
  'lhmc': '/logos/colleges/lhmc-delhi.png',
  'lady hardinge': '/logos/colleges/lhmc-delhi.png',
  'bmcri': '/logos/colleges/bmcri-bangalore.png',
  'mmc chennai': '/logos/colleges/mmc-chennai.jpg',
  'madras medical': '/logos/colleges/mmc-chennai.jpg',
  'sms jaipur': '/logos/colleges/sms-ruhs-jaipur.png',
  'sawai man singh': '/logos/colleges/sms-ruhs-jaipur.png',
  'gmch guwahati': '/logos/colleges/gmch-guwahati.jpg',
  'gauhati medical': '/logos/colleges/gmch-guwahati.jpg',
  'igmc shimla': '/logos/colleges/igmc-shimla.png',
  'goa medical': '/logos/colleges/gmc-goa.png',
  'pgims rohtak': '/logos/colleges/pgims-rohtak.png',
  'kcgmc': '/logos/colleges/kcgmc-karnal.jpg',
  'kalpana chawla': '/logos/colleges/kcgmc-karnal.jpg'
};

for (const [k, v] of Object.entries(specialAliases)) {
  byName[k] = v;
}

const finalPayload = { byId, byName, aiimsLogos };
fs.writeFileSync('public/data/medical_college_logos.json', JSON.stringify(finalPayload, null, 2));
console.log('Built public/data/medical_college_logos.json');
console.log('Total byId:', Object.keys(byId).length);
console.log('Total byName:', Object.keys(byName).length);
