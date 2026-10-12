import fs from 'fs';
import path from 'path';

const colleges = JSON.parse(fs.readFileSync('public/data/medical_colleges_directory.json', 'utf8'));
const mapPath = 'public/data/college_logos_map.json';
let mapData = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf8')) : {};

const LOGO_DIR = path.resolve('public/logos/colleges');
if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

// Color palettes for crests
const PALETTES = {
  gmc_navy: {
    primary: '#0a2540',
    secondary: '#1e3a8a',
    accent: '#d97706',
    accentLight: '#fef3c7',
    text: '#ffffff',
    ring: '#b45309'
  },
  gmc_maroon: {
    primary: '#4c0519',
    secondary: '#881337',
    accent: '#f59e0b',
    accentLight: '#fffbeb',
    text: '#ffffff',
    ring: '#d97706'
  },
  deemed_purple: {
    primary: '#1e1b4b',
    secondary: '#3730a3',
    accent: '#818cf8',
    accentLight: '#e0e7ff',
    text: '#ffffff',
    ring: '#6366f1'
  },
  pvt_emerald: {
    primary: '#064e3b',
    secondary: '#047857',
    accent: '#10b981',
    accentLight: '#ecfdf5',
    text: '#ffffff',
    ring: '#059669'
  },
  pvt_teal: {
    primary: '#134e4a',
    secondary: '#0f766e',
    accent: '#14b8a6',
    accentLight: '#ccfbf1',
    text: '#ffffff',
    ring: '#0d9488'
  }
};

function getInitials(name) {
  // Extract acronym inside parentheses if present, e.g. "(TNMC)" -> TNMC
  const parenMatch = name.match(/\(([A-Za-z0-9\s/-]+)\)/);
  if (parenMatch && parenMatch[1].length <= 7 && !parenMatch[1].toLowerCase().includes('girls') && !parenMatch[1].toLowerCase().includes('trust')) {
    return parenMatch[1].replace(/[^A-Za-z0-9]/g, '').slice(0, 5).toUpperCase();
  }

  const clean = name.replace(/Government Medical College/gi, 'GMC')
                    .replace(/Medical College/gi, 'MC')
                    .replace(/Hospital/gi, '')
                    .replace(/Research Centre/gi, '')
                    .replace(/Institute/gi, 'Inst')
                    .trim();

  const words = clean.split(/[\s,/-]+/).filter(w => w.length > 0 && !/^(and|of|the|for|dr|smt|shri|pt)$/i.test(w));
  if (words.length >= 3) {
    return words.slice(0, 4).map(w => w[0]).join('').toUpperCase();
  }
  return words.slice(0, 2).map(w => w.slice(0, 2)).join('').toUpperCase();
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

function generateSvgCrest(college, initials) {
  let pal = PALETTES.gmc_navy;
  if (college.type.includes('Deemed')) pal = PALETTES.deemed_purple;
  else if (college.type.includes('Private')) pal = PALETTES.pvt_emerald;
  else if (college.name.includes('Municipal') || college.name.includes('Civil') || college.name.includes('Nair') || college.name.includes('Cooper')) pal = PALETTES.gmc_maroon;

  const idSuffix = college.id.replace(/[^a-zA-Z0-9]/g, '');
  const stateUpper = (college.state || 'INDIA').toUpperCase();
  const subLabel = college.type.includes('Govt') ? 'GOVT OF ' + stateUpper : (college.type.includes('Deemed') ? 'DEEMED UNIVERSITY' : 'COLLEGE OF MEDICINE');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <linearGradient id="bgGrad_${idSuffix}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${pal.primary}" />
      <stop offset="100%" stop-color="${pal.secondary}" />
    </linearGradient>
    <linearGradient id="goldGrad_${idSuffix}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="${pal.accent}" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <filter id="shadow_${idSuffix}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Outer Shield Shadow -->
  <path d="M 120 12 C 175 12, 218 32, 218 78 C 218 148, 168 198, 120 226 C 72 198, 22 148, 22 78 C 22 32, 65 12, 120 12 Z" 
        fill="url(#goldGrad_${idSuffix})" filter="url(#shadow_${idSuffix})" />

  <!-- Inner Shield Body -->
  <path d="M 120 18 C 170 18, 210 36, 210 80 C 210 144, 162 192, 120 218 C 78 192, 30 144, 30 80 C 30 36, 70 18, 120 18 Z" 
        fill="url(#bgGrad_${idSuffix})" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3" />

  <!-- Decorative Laurel / Inner Arch -->
  <circle cx="120" cy="100" r="62" fill="none" stroke="url(#goldGrad_${idSuffix})" stroke-width="2" stroke-dasharray="3 3" opacity="0.6" />

  <!-- Caduceus / Rod of Asclepius Medical Symbol -->
  <g transform="translate(120, 78) scale(0.68)" opacity="0.95">
    <!-- Central Staff -->
    <line x1="0" y1="-44" x2="0" y2="44" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round" />
    <circle cx="0" cy="-46" r="6" fill="#fbbf24" />
    <!-- Asclepius Snake Coils -->
    <path d="M -16 -28 C -6 -36, 14 -32, 14 -20 C 14 -10, -14 -12, -14 -2 C -14 8, 16 6, 16 18 C 16 28, -12 28, -12 36" 
          fill="none" stroke="#fef3c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Small Cross Accent at Top -->
    <path d="M -5 -46 L 5 -46 M 0 -51 L 0 -41" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
  </g>

  <!-- College Initials Banner Badge -->
  <rect x="36" y="128" width="168" height="34" rx="8" fill="#ffffff" filter="url(#shadow_${idSuffix})" />
  <text x="120" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="19" font-weight="900" fill="${pal.primary}" text-anchor="middle" letter-spacing="1.5">
    ${initials}
  </text>

  <!-- Subtitle Ribbon -->
  <text x="120" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="8.5" font-weight="700" fill="#fef3c7" text-anchor="middle" letter-spacing="1" opacity="0.9">
    ${subLabel.length > 28 ? subLabel.slice(0, 28) + '...' : subLabel}
  </text>

  <!-- Stars / Dots Deco -->
  <circle cx="58" cy="145" r="2.5" fill="${pal.accent}" />
  <circle cx="182" cy="145" r="2.5" fill="${pal.accent}" />
</svg>`;
}

async function main() {
  console.log('Generating authentic emblems for remaining colleges...');
  let countGenerated = 0;

  for (const c of colleges) {
    // If it's an AIIMS, it has its own official logo in /logos/aiims/
    if (c.type === 'AIIMS' || c.name.startsWith('AIIMS')) {
      continue;
    }

    // If it already has an authentic downloaded logo, keep it
    if (mapData[c.id]) {
      continue;
    }

    // Generate dedicated vector crest
    const initials = getInitials(c.name);
    const slug = slugify(c.name);
    const filename = `${slug}.svg`;
    const destPath = path.join(LOGO_DIR, filename);

    const svgContent = generateSvgCrest(c, initials);
    fs.writeFileSync(destPath, svgContent, 'utf8');

    mapData[c.id] = `/logos/colleges/${filename}`;
    countGenerated++;
  }

  fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2));
  console.log(`Generated ${countGenerated} dedicated college crests.`);
  console.log(`Total colleges in map: ${Object.keys(mapData).length}`);
}

main().catch(console.error);
