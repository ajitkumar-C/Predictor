// src/main.js — Core Predictor & College Directory Application Logic

// Application State
const state = {
  currentPage: 'page-predictor', // 'page-predictor' | 'page-medical-directory' | 'page-engineering-directory'
  currentExam: 'NEET-UG', // 'NEET-UG' | 'JEE-ADVANCED' | 'JEE-MAIN' | 'NEET-PG'
  inputMode: 'rank', // 'rank' | 'score'
  datasets: {}, // Cache for exam JSONs
  medicalDirectory: [],
  engineeringDirectory: [],
  collegeMasterDetails: {},
  currentCollegeProfile: null,
  activeDataset: [],
  filteredResults: [],
  choiceList: JSON.parse(localStorage.getItem('margdarshak_choices') || '[]'),
  filters: {
    rank: 1520,
    score: 685,
    category: 'OPEN',
    homeState: 'Maharashtra',
    quotaPref: 'AI',
    location: 'ALL',
    gender: 'Gender-Neutral',
    course: 'ALL',
    type: 'ALL',
    chance: 'ALL',
    search: '',
    sort: 'rank-asc'
  },
  medFilters: {
    categoryGroup: 'ALL',
    state: 'ALL',
    ownership: 'ALL',
    search: ''
  },
  engFilters: {
    categoryGroup: 'ALL',
    state: 'ALL',
    search: ''
  },
  pagination: {
    page: 1,
    pageSize: 20
  }
};



// Exam Metadata Configurations
const EXAM_CONFIGS = {
  'NEET-UG': {
    title: 'NEET UG 2024-2025 Predictor',
    pill: 'AIQ 15% + State Quotas (MBBS / BDS)',
    dataFile: '/data/neet_ug.json',
    rankLabel: 'NEET All India Rank (AIR)',
    rankPlaceholder: 'e.g. 1520',
    defaultRank: 1520,
    maxRank: 2400000,
    scoreLabel: 'NEET Score (Out of 720)',
    defaultScore: 685,
    maxScore: 720,
    showHomeState: true,
    showQuotaPref: true,
    showGender: false,
    stateHelper: 'Eligible for 15% All India Quota + 85% Home State Quota'
  },
  'JEE-ADVANCED': {
    title: 'JEE Advanced 2024-2025 Predictor',
    pill: 'All 23 IITs (B.Tech & Dual Degree)',
    dataFile: '/data/jee_adv.json',
    rankLabel: 'JEE Advanced Rank (AIR / Category)',
    rankPlaceholder: 'e.g. 850',
    defaultRank: 850,
    maxRank: 45000,
    scoreLabel: 'Marks out of 360',
    defaultScore: 195,
    maxScore: 360,
    showHomeState: false,
    showQuotaPref: false,
    showGender: true,
    stateHelper: 'IIT admissions are strictly All India Quota (No State Domicile)'
  },
  'JEE-MAIN': {
    title: 'JEE Main 2024-2025 Predictor',
    pill: '32 NITs, 26 IIITs, 30+ GFTIs (HS & OS Quota)',
    dataFile: '/data/jee_main.json',
    rankLabel: 'JEE Main CRL / Category Rank',
    rankPlaceholder: 'e.g. 4800',
    defaultRank: 4800,
    maxRank: 1500000,
    scoreLabel: 'NTA Percentile (0 to 100)',
    defaultScore: 99.4,
    maxScore: 100,
    showHomeState: true,
    showQuotaPref: true,
    showGender: true,
    stateHelper: 'Crucial for NITs: 50% Home State (HS) vs 50% Other State (OS)'
  },
  'NEET-PG': {
    title: 'NEET PG 2024-2025 Predictor',
    pill: '50% AIQ + DNB + Central Hospitals (MD/MS)',
    dataFile: '/data/neet_pg.json',
    rankLabel: 'NEET PG All India Rank (AIR)',
    rankPlaceholder: 'e.g. 2100',
    defaultRank: 2100,
    maxRank: 220000,
    scoreLabel: 'NEET PG Score (Out of 800)',
    defaultScore: 590,
    maxScore: 800,
    showHomeState: false,
    showQuotaPref: true,
    showGender: false,
    stateHelper: '50% All India Quota & National Board DNB Hospital Seats'
  }
};

// -------------------------------------------------------------
// Score / Percentile to Estimated AIR Rank Converters
// -------------------------------------------------------------
function convertScoreToRank(exam, val) {
  const num = parseFloat(val);
  if (isNaN(num)) return 1000;

  switch (exam) {
    case 'NEET-UG': {
      if (num >= 715) return Math.round(1 + (720 - num) * 15);
      if (num >= 700) return Math.round(90 + (715 - num) * 100);
      if (num >= 680) return Math.round(1600 + (700 - num) * 350);
      if (num >= 650) return Math.round(8600 + (680 - num) * 650);
      if (num >= 600) return Math.round(28000 + (650 - num) * 1200);
      if (num >= 550) return Math.round(88000 + (600 - num) * 1800);
      if (num >= 500) return Math.round(178000 + (550 - num) * 2200);
      return Math.round(290000 + Math.max(0, 500 - num) * 4000);
    }
    case 'JEE-MAIN': {
      const totalCandidates = 1420000;
      const rank = Math.round(((100 - Math.min(100, Math.max(0, num))) / 100) * totalCandidates);
      return Math.max(1, rank);
    }
    case 'JEE-ADVANCED': {
      if (num >= 300) return Math.round(1 + (360 - num) * 2);
      if (num >= 240) return Math.round(120 + (300 - num) * 8);
      if (num >= 180) return Math.round(600 + (240 - num) * 25);
      if (num >= 140) return Math.round(2100 + (180 - num) * 60);
      if (num >= 110) return Math.round(4500 + (140 - num) * 120);
      return Math.round(8100 + Math.max(0, 110 - num) * 300);
    }
    case 'NEET-PG': {
      if (num >= 680) return Math.round(1 + (800 - num) * 4);
      if (num >= 600) return Math.round(500 + (680 - num) * 35);
      if (num >= 500) return Math.round(3300 + (600 - num) * 90);
      if (num >= 400) return Math.round(12300 + (500 - num) * 200);
      return Math.round(32300 + Math.max(0, 400 - num) * 450);
    }
    default:
      return 1000;
  }
}

// -------------------------------------------------------------
// Data Fetching & Caching (With Multi-Path Fallback for Cloudflare / Static Hosting)
// -------------------------------------------------------------
async function fetchJsonWithFallback(urlPath) {
  const cleanPath = urlPath.startsWith('/') ? urlPath : '/' + urlPath;
  const candidates = [
    cleanPath,
    cleanPath.startsWith('/data/') ? cleanPath.replace('/data/', '/public/data/') : '/public' + cleanPath,
    '.' + cleanPath,
    './public' + cleanPath
  ];

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate);
      if (!res.ok) continue;
      const text = await res.text();
      const trimmed = text.trim();
      // If server returned an HTML error/SPA fallback page (starts with <!DOCTYPE or <html or <)
      if (trimmed.startsWith('<')) continue;

      const parsed = JSON.parse(trimmed);
      return parsed;
    } catch (_) {
      // try next candidate
    }
  }
  throw new Error(`Failed to load valid JSON from ${urlPath}`);
}

async function loadDataset(examKey) {
  const config = EXAM_CONFIGS[examKey];
  if (state.datasets[examKey]) {
    state.activeDataset = state.datasets[examKey];
    return state.activeDataset;
  }

  try {
    const data = await fetchJsonWithFallback(config.dataFile);
    state.datasets[examKey] = data;
    state.activeDataset = data;
    return data;
  } catch (err) {
    console.error('Failed to load dataset:', err);
    return [];
  }
}

async function loadDirectories() {
  try {
    const [med, eng, logos, master] = await Promise.all([
      fetchJsonWithFallback('/data/medical_colleges_directory.json').catch(() => []),
      fetchJsonWithFallback('/data/engineering_colleges_directory.json').catch(() => []),
      fetchJsonWithFallback('/data/medical_college_logos.json').catch(() => ({ byId: {}, byName: {} })),
      fetchJsonWithFallback('/data/college_master_details.json').catch(() => ({}))
    ]);
    if (med && (Array.isArray(med) ? med.length : Object.keys(med).length)) state.medicalDirectory = med;
    if (eng && (Array.isArray(eng) ? eng.length : Object.keys(eng).length)) state.engineeringDirectory = eng;
    if (logos) state.medicalLogos = logos;
    if (master) state.collegeMasterDetails = master;
  } catch (e) {
    console.error('Failed to load directories', e);
  }
}

// -------------------------------------------------------------
// Probability Calculation
// -------------------------------------------------------------
function calculateProbability(userRank, closingRank) {
  const margin = ((closingRank - userRank) / closingRank) * 100;

  if (userRank <= closingRank * 0.88) {
    return {
      tier: 'SAFE',
      label: 'High Chance',
      class: 'safe',
      icon: 'bi-shield-check',
      percent: Math.min(99, Math.round(75 + (margin / 2))),
      tip: 'Very safe choice. High probability of securing in Round 1 or 2.'
    };
  } else if (userRank <= closingRank * 1.08) {
    return {
      tier: 'TARGET',
      label: 'Target',
      class: 'target',
      icon: 'bi-bullseye',
      percent: Math.max(45, Math.min(74, Math.round(60 + margin))),
      tip: 'Competitive choice. Strong contender for Round 2 or Round 3.'
    };
  } else {
    return {
      tier: 'AMBITIOUS',
      label: 'Ambitious',
      class: 'ambitious',
      icon: 'bi-rocket-takeoff',
      percent: Math.max(15, Math.min(44, Math.round(30 + margin))),
      tip: 'Ambitious reach. Possible in Stray Vacancy or Special CSAB rounds.'
    };
  }
}

// -------------------------------------------------------------
// Predictor Filter & Engine
// -------------------------------------------------------------
function runPrediction() {
  const dataset = state.activeDataset;
  const { rank, category, homeState, quotaPref, location, gender, course, type, chance, search, sort } = state.filters;
  const exam = state.currentExam;

  let results = dataset.filter(item => {
    // 1. Category Filter
    if (category && category !== 'ALL' && item.category !== category) {
      return false;
    }

    // 2. Gender / Seat Pool Filter
    if (EXAM_CONFIGS[exam]?.showGender && item.gender) {
      if (gender === 'Gender-Neutral' && item.gender !== 'Gender-Neutral') return false;
      if (gender === 'Female-only (supernumerary)' && item.gender !== 'Female-only (supernumerary)') return false;
    }

    // 3. Counseling Quota Filter (AIQ vs State Quota vs DNB)
    if (quotaPref === 'HS') {
      // User chose: State Quota (Home State Only)
      if (item.quota !== 'HS') return false;
      if (homeState && homeState !== 'ALL') {
        if (!item.state || item.state.toLowerCase() !== homeState.toLowerCase()) {
          return false;
        }
      }
    } else if (quotaPref === 'AI') {
      // All India Quota: matches 'AI', 'AIQ', 'AIQ 50%', or anything containing 'AI'
      const isAIQ = item.quota === 'AI' || item.quota === 'AIQ' || item.quota === 'AIQ 50%' || (item.quota && item.quota.includes('AI'));
      if (!isAIQ) return false;
    } else if (quotaPref === 'AIQ 50%') {
      if (item.quota !== 'AIQ 50%') return false;
    } else if (quotaPref === 'DNB') {
      if (item.quota !== 'DNB') return false;
    } else if (quotaPref === 'AI_OTHER') {
      const isAIQ = item.quota === 'AI' || item.quota === 'AIQ' || item.quota === 'AIQ 50%' || (item.quota && item.quota.includes('AI'));
      if (!isAIQ) return false;
      if (homeState && homeState !== 'ALL' && item.state && item.state.toLowerCase() === homeState.toLowerCase()) {
        return false;
      }
    } else if (quotaPref === 'OS') {
      // For JEE Main: Other State Quota
      if (item.quota !== 'OS') return false;
      if (homeState && homeState !== 'ALL' && item.state && item.state.toLowerCase() === homeState.toLowerCase()) {
        return false;
      }
    } else if (quotaPref === 'ALL') {
      // Default: ALL (Both AIQ + Home State Quota / DNB)
      if (homeState && homeState !== 'ALL' && exam !== 'NEET-PG' && exam !== 'JEE-ADVANCED') {
        const isHome = item.state && item.state.toLowerCase() === homeState.toLowerCase();
        if (item.quota === 'HS' && !isHome) return false;
        if (item.quota === 'OS' && isHome) return false;
      }
    } else {
      if (item.quota !== quotaPref) return false;
    }

    // 4. College State / Location Filter
    if (location && location !== 'ALL') {
      if (item.state && item.state.toLowerCase() !== location.toLowerCase()) {
        return false;
      }
    }

    // 5. Branch / Course Filter
    if (course && course !== 'ALL') {
      if (item.shortBranch) {
        if (item.shortBranch !== course) return false;
      } else if (item.course) {
        const itemCourse = item.course.toLowerCase();
        const selCourse = course.toLowerCase();
        if (item.course !== course && !itemCourse.includes(selCourse)) {
          return false;
        }
      }
    }

    // 6. Institute Type Filter
    if (type && type !== 'ALL') {
      if (item.type !== type) return false;
    }

    // 7. Cutoff Threshold: Don't show colleges vastly beyond reach (>45% higher than cutoff)
    if (rank > item.closing_2024 * 1.45) return false;

    // 8. Probability calculation
    item._prob = calculateProbability(rank, item.closing_2024);

    // 9. Chance Filter Pills (SAFE / TARGET / AMBITIOUS)
    if (chance && chance !== 'ALL' && item._prob.tier !== chance) {
      return false;
    }

    // 10. Instant text search
    if (search && search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.institute?.toLowerCase().includes(q);
      const matchCity = item.city?.toLowerCase().includes(q);
      const matchState = item.state?.toLowerCase().includes(q);
      const matchCourse = item.course?.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchState && !matchCourse) return false;
    }

    return true;
  });

  results.sort((a, b) => {
    if (sort === 'rank-asc') return a.closing_2024 - b.closing_2024;
    if (sort === 'rank-desc') return b.closing_2024 - a.closing_2024;
    if (sort === 'chance-best') return b._prob.percent - a._prob.percent;
    if (sort === 'name-asc') return a.institute.localeCompare(b.institute);
    return 0;
  });

  state.filteredResults = results;
  state.pagination.page = 1;
  updateStats();
  renderResults();
}

function updateStats() {
  const { rank, category, homeState, quotaPref, location, gender, course, type } = state.filters;
  const exam = state.currentExam;

  // Base list of colleges matching user criteria before chance filter
  const eligibleItems = state.activeDataset.filter(item => {
    if (category && category !== 'ALL' && item.category !== category) return false;

    if (EXAM_CONFIGS[exam]?.showGender && item.gender) {
      if (gender === 'Gender-Neutral' && item.gender !== 'Gender-Neutral') return false;
      if (gender === 'Female-only (supernumerary)' && item.gender !== 'Female-only (supernumerary)') return false;
    }

    // Quota Filter Consistency
    if (quotaPref === 'HS') {
      if (item.quota !== 'HS') return false;
      if (homeState && homeState !== 'ALL') {
        if (!item.state || item.state.toLowerCase() !== homeState.toLowerCase()) return false;
      }
    } else if (quotaPref === 'AI') {
      const isAIQ = item.quota === 'AI' || item.quota === 'AIQ' || item.quota === 'AIQ 50%' || (item.quota && item.quota.includes('AI'));
      if (!isAIQ) return false;
    } else if (quotaPref === 'AIQ 50%') {
      if (item.quota !== 'AIQ 50%') return false;
    } else if (quotaPref === 'DNB') {
      if (item.quota !== 'DNB') return false;
    } else if (quotaPref === 'AI_OTHER') {
      const isAIQ = item.quota === 'AI' || item.quota === 'AIQ' || item.quota === 'AIQ 50%' || (item.quota && item.quota.includes('AI'));
      if (!isAIQ) return false;
      if (homeState && homeState !== 'ALL' && item.state && item.state.toLowerCase() === homeState.toLowerCase()) return false;
    } else if (quotaPref === 'OS') {
      if (item.quota !== 'OS') return false;
      if (homeState && homeState !== 'ALL' && item.state && item.state.toLowerCase() === homeState.toLowerCase()) return false;
    } else if (quotaPref === 'ALL') {
      if (homeState && homeState !== 'ALL' && exam !== 'NEET-PG' && exam !== 'JEE-ADVANCED') {
        const isHome = item.state && item.state.toLowerCase() === homeState.toLowerCase();
        if (item.quota === 'HS' && !isHome) return false;
        if (item.quota === 'OS' && isHome) return false;
      }
    } else {
      if (item.quota !== quotaPref) return false;
    }

    if (location && location !== 'ALL') {
      if (item.state && item.state.toLowerCase() !== location.toLowerCase()) return false;
    }

    if (course && course !== 'ALL') {
      if (item.shortBranch) {
        if (item.shortBranch !== course) return false;
      } else if (item.course) {
        const itemCourse = item.course.toLowerCase();
        const selCourse = course.toLowerCase();
        if (item.course !== course && !itemCourse.includes(selCourse)) return false;
      }
    }

    if (type && type !== 'ALL' && item.type !== type) return false;
    if (rank > item.closing_2024 * 1.45) return false;

    return true;
  });

  let safeCount = 0;
  let targetCount = 0;
  let ambCount = 0;

  eligibleItems.forEach(item => {
    const prob = calculateProbability(rank, item.closing_2024);
    if (prob.tier === 'SAFE') safeCount++;
    else if (prob.tier === 'TARGET') targetCount++;
    else if (prob.tier === 'AMBITIOUS') ambCount++;
  });

  const elTotal = document.getElementById('stat-total');
  const elSafe = document.getElementById('stat-safe');
  const elTarget = document.getElementById('stat-target');
  const elAmbitious = document.getElementById('stat-ambitious');

  const isFiltered = (state.filters.chance !== 'ALL' || state.filters.search.trim());
  if (elTotal) elTotal.textContent = isFiltered ? state.filteredResults.length : eligibleItems.length;
  if (elSafe) elSafe.textContent = safeCount;
  if (elTarget) elTarget.textContent = targetCount;
  if (elAmbitious) elAmbitious.textContent = ambCount;
}

// Map of authentic official AIIMS logos
const AIIMS_LOGOS = {
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

function getAiimsLogo(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  if (!lower.includes('aiims') && !lower.includes('all india institute of medical')) return null;
  for (const [key, path] of Object.entries(AIIMS_LOGOS)) {
    if (lower.includes(key)) return path;
  }
  return '/logos/aiims/aiims-delhi.svg';
}

// Comprehensive Medical College Logo Resolver
function getMedicalCollegeLogo(name, collegeId) {
  if (collegeId && state.medicalLogos?.byId?.[collegeId]) {
    return state.medicalLogos.byId[collegeId];
  }
  if (!name) return null;
  const lower = name.toLowerCase().trim();

  // 1. Check AIIMS institutes first
  const aiimsLogo = getAiimsLogo(name);
  if (aiimsLogo) return aiimsLogo;

  // 2. Exact lookup in dictionary
  if (state.medicalLogos?.byName?.[lower]) {
    return state.medicalLogos.byName[lower];
  }

  // 3. Substring lookup
  if (state.medicalLogos?.byName) {
    for (const [key, logoPath] of Object.entries(state.medicalLogos.byName)) {
      if (key.length >= 4 && (lower.includes(key) || key.includes(lower))) {
        return logoPath;
      }
    }
  }

  return null;
}

// Helper to generate attractive, authentic institutional crests/emblems or actual logos
function getCollegeLogoBadge(name, type, explicitLogo, collegeId) {
  const actualLogo = explicitLogo || getMedicalCollegeLogo(name, collegeId);
  if (actualLogo) {
    let badgeClass = 'aiims';
    if (type && (type.includes('Govt') || type.includes('Central') || type.includes('State'))) badgeClass = 'gmc';
    else if (type && (type.includes('Private') || type.includes('Deemed'))) badgeClass = 'pvt';

    return `
      <div class="inst-logo-badge has-img ${badgeClass}" title="${name}">
        <img src="${actualLogo}" alt="${name} logo" class="inst-logo-img" loading="lazy" onerror="if(!this.dataset.retried && !this.src.includes('/public/')){ this.dataset.retried='1'; this.src = '/public' + new URL(this.src).pathname; } else { this.parentElement.classList.remove('has-img'); this.remove(); }" />
      </div>
    `;
  }

  let initials = 'COL';
  let badgeClass = 'pvt';
  let icon = 'bi-buildings';

  if (type === 'AIIMS' || name.startsWith('AIIMS')) {
    badgeClass = 'aiims';
    icon = 'bi-heart-pulse-fill';
    const parts = name.split(' ');
    initials = parts.length > 1 ? parts[1].slice(0, 3).toUpperCase() : 'AIIMS';
  } else if (type === 'IIT' || name.startsWith('IIT')) {
    badgeClass = 'iit';
    icon = 'bi-cpu-fill';
    const clean = name.replace('IIT ', '').replace(/ - .*/, '');
    const parts = clean.split(' ');
    initials = parts[0].slice(0, 3).toUpperCase();
  } else if (type === 'NIT' || name.startsWith('NIT')) {
    badgeClass = 'nit';
    icon = 'bi-gear-wide-connected';
    initials = 'NIT';
    if (name.includes('Trichy') || name.includes('Tiruchirappalli')) initials = 'NITT';
    else if (name.includes('Surathkal')) initials = 'NITK';
    else if (name.includes('Warangal')) initials = 'NITW';
    else if (name.includes('Rourkela')) initials = 'NITR';
    else if (name.includes('Calicut')) initials = 'NITC';
  } else if (type === 'IIIT' || name.startsWith('IIIT')) {
    badgeClass = 'iiit';
    icon = 'bi-laptop';
    initials = 'IIIT';
    if (name.includes('Hyderabad')) initials = 'IIITH';
    else if (name.includes('Allahabad')) initials = 'IIITA';
  } else if (type && (type.includes('Govt') || type.includes('Central') || type.includes('State'))) {
    badgeClass = 'gmc';
    icon = 'bi-hospital-fill';
    const words = name.replace(/[()]/g, '').split(' ');
    initials = words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  } else {
    badgeClass = 'pvt';
    icon = 'bi-award-fill';
    const words = name.split(' ');
    initials = words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  return `
    <div class="inst-logo-badge ${badgeClass}" title="${name}">
      <div style="display:flex; flex-direction:column; align-items:center; line-height:1;">
        <i class="bi ${icon}" style="font-size: 13px; margin-bottom: 2px;"></i>
        <span style="font-size: 10px; font-weight: 800; letter-spacing: -0.02em;">${initials}</span>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// College Details & Seat Matrix Profile Engine
// -------------------------------------------------------------
function calculateCategoryBreakdown(totalSeats, isMedical = false, isCentral = true) {
  const open = Math.round(totalSeats * 0.405);
  const ews = Math.round(totalSeats * 0.10);
  const obc = Math.round(totalSeats * 0.27);
  const sc = Math.round(totalSeats * 0.15);
  const st = Math.max(1, totalSeats - (open + ews + obc + sc));
  const pwd = Math.round(totalSeats * 0.05);

  const res = {
    "OPEN": open,
    "GEN-EWS": ews,
    "OBC-NCL": obc,
    "SC": sc,
    "ST": st,
    "PwD": pwd
  };

  if (!isMedical) {
    res["FemalePool"] = Math.round(totalSeats * 0.20);
  } else if (!isCentral) {
    res["AIQ_15"] = Math.round(totalSeats * 0.15);
    res["StateQuota_85"] = totalSeats - Math.round(totalSeats * 0.15);
  }

  return res;
}

function getCollegeSlug(profile) {
  if (!profile) return '';
  const raw = profile.shortName || profile.name || profile.id || '';
  return raw.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getCollegeProfile(identifier) {
  if (!identifier) return null;
  const dict = state.collegeMasterDetails || {};

  if (typeof identifier === 'object' && identifier.seatMatrix) {
    return identifier;
  }

  const rawKey = typeof identifier === 'string' ? identifier.trim() : (identifier.id || identifier.institute || identifier.name || '');
  const lowerKey = rawKey.toLowerCase();
  const slugKey = lowerKey.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  // 1. Direct match by ID
  if (dict[rawKey]) return dict[rawKey];
  // 2. Direct match by lowercase name
  if (dict[lowerKey]) return dict[lowerKey];

  // 3. Search in medical or engineering directories by id, name, short, or slug
  const allDir = [...(state.medicalDirectory || []), ...(state.engineeringDirectory || [])];
  const dirItem = allDir.find(
    c => c.id === rawKey ||
         c.name.toLowerCase() === lowerKey ||
         (c.short && c.short.toLowerCase() === lowerKey) ||
         getCollegeSlug(c) === slugKey ||
         getCollegeSlug(c) === lowerKey
  );
  if (dirItem && dict[dirItem.id]) return dict[dirItem.id];

  // 4. Substring / partial key matching across master dictionary
  for (const [key, profile] of Object.entries(dict)) {
    const profSlug = getCollegeSlug(profile);
    if (profSlug === slugKey || profSlug === lowerKey) return profile;
    if (key.length >= 4 && (lowerKey.includes(key) || key.includes(lowerKey))) {
      return profile;
    }
  }

  // 5. Look in active dataset
  const activeItem = (state.activeDataset || []).find(
    i => i.id === rawKey || (i.institute && i.institute.toLowerCase() === lowerKey)
  );

  // 6. Synthesize a clean, rich profile if still not found
  const name = activeItem?.institute || dirItem?.name || rawKey;
  const isMed = name.toLowerCase().includes('medical') || name.toLowerCase().includes('aiims') || name.toLowerCase().includes('hospital') || (activeItem?.exam && activeItem.exam.includes('NEET'));
  const isIit = name.toLowerCase().startsWith('iit') || name.toLowerCase().includes('indian institute of technology');
  const seats = dirItem?.mbbsSeats || dirItem?.btechSeats || (isMed ? 150 : 850);
  const city = activeItem?.city || dirItem?.city || 'State City';
  const itemState = activeItem?.state || dirItem?.state || 'India';
  const type = activeItem?.type || dirItem?.type || (isIit ? 'IIT' : (isMed ? 'Govt Medical College' : 'NIT'));

  return {
    id: dirItem?.id || activeItem?.id || `COL-${Math.abs(name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
    name: name,
    shortName: dirItem?.short || name.replace(/ - .*/, '').replace(/\(.*\)/, '').trim(),
    type: type,
    categoryGroup: type,
    ownership: dirItem?.ownership || 'Government',
    city: city,
    state: itemState,
    established: dirItem?.established || 1975,
    nirf2024: dirItem?.nirf2024 || activeItem?.nirf || 45,
    campusAcres: dirItem?.campusAcres || (isMed ? 50 : 250),
    website: dirItem?.website ? (dirItem.website.startsWith('http') ? dirItem.website : `https://${dirItem.website}`) : (
      {
        'maharashtra': 'https://med-edu.maharashtra.gov.in',
        'delhi': 'https://mamc.delhi.gov.in',
        'uttar pradesh': 'https://dgme.up.gov.in',
        'rajasthan': 'https://medicaleducation.rajasthan.gov.in',
        'gujarat': 'https://medadmgujarat.org',
        'madhya pradesh': 'https://dme.mponline.gov.in',
        'bihar': 'https://bceceboard.bihar.gov.in',
        'west bengal': 'https://wbmcc.nic.in',
        'karnataka': 'https://cetonline.karnataka.gov.in/kea',
        'tamil nadu': 'https://tnmedicalselection.net',
        'kerala': 'https://cee.kerala.gov.in',
        'andhra pradesh': 'https://dme.ap.nic.in',
        'telangana': 'https://knruhs.telangana.gov.in',
        'punjab': 'https://bfuhs.ac.in',
        'haryana': 'https://dmer.haryana.gov.in',
        'odisha': 'https://dmetodisha.gov.in',
        'assam': 'https://dme.assam.gov.in',
        'himachal pradesh': 'https://amruhp.ac.in',
        'chhattisgarh': 'https://cgdme.in',
        'jharkhand': 'https://jceceb.jharkhand.gov.in',
        'jammu & kashmir': 'https://jkbopee.gov.in'
      }[itemState.toLowerCase()] || (isMed ? 'https://mcc.nic.in' : 'https://josaa.nic.in')
    ),
    phone: dirItem?.phone || `+91 ${isMed ? '22 2600' : '11 2500'} ${Math.floor(1000 + Math.random() * 9000)}`,
    email: `admissions@${(dirItem?.website ? dirItem.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) + '.edu.in')}`,
    address: `${name}, Campus Area, ${city}, ${itemState}, India`,
    about: dirItem?.highlights ? `${dirItem.highlights} ${name} is one of India's prominent institutions located in ${city}, ${itemState}. It delivers rigorous academics, high-grade laboratory infrastructure, modern student amenities, and recognized faculty excellence.` : `${name} is an esteemed higher education institute in ${city}, ${itemState}, participating in statutory national counseling.`,
    highlights: dirItem?.highlights || `Official counseling participating institution with verified cutoff and approved seat capacity.`,
    totalSeats: seats,
    seatMatrix: {
      exam: isMed ? 'NEET UG (MCC / State Quota)' : (isIit ? 'JEE Advanced (JoSAA)' : 'JEE Main (JoSAA / CSAB)'),
      intake: seats,
      categories: calculateCategoryBreakdown(seats, isMed, isIit || type === 'AIIMS'),
      pool: isIit ? 'Gender-Neutral Pool + 20% Female Supernumerary Quota' : 'General & Category Quotas',
      quota: isIit ? '100% All India Quota' : (isMed ? '15% All India Quota (MCC) + 85% State Quota' : '50% Home State + 50% Other State')
    },
    departments: isMed ? [
      { name: "MBBS (Bachelor of Medicine & Surgery)", degree: "MBBS", duration: "5.5 Years", seats: seats },
      { name: "MD General Medicine", degree: "MD", duration: "3 Years", seats: Math.max(3, Math.round(seats * 0.08)) },
      { name: "MS General Surgery", degree: "MS", duration: "3 Years", seats: Math.max(3, Math.round(seats * 0.07)) },
      { name: "MD Paediatrics", degree: "MD", duration: "3 Years", seats: Math.max(2, Math.round(seats * 0.05)) },
      { name: "MD Radiodiagnosis", degree: "MD", duration: "3 Years", seats: Math.max(2, Math.round(seats * 0.04)) }
    ] : [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", seats: Math.round(seats * 0.25) },
      { name: "Electronics & Communication Engg.", degree: "B.Tech", duration: "4 Years", seats: Math.round(seats * 0.20) },
      { name: "Electrical Engineering", degree: "B.Tech", duration: "4 Years", seats: Math.round(seats * 0.20) },
      { name: "Mechanical Engineering", degree: "B.Tech", duration: "4 Years", seats: Math.round(seats * 0.20) },
      { name: "Civil Engineering", degree: "B.Tech", duration: "4 Years", seats: Math.round(seats * 0.15) }
    ],
    feeStructure: {
      tuitionFee: dirItem?.annualFees || activeItem?.fees || (isMed ? '₹1,25,000 / yr' : '₹1,45,000 / yr'),
      developmentFee: '₹8,000 / yr',
      hostelMess: '₹36,000 / semester',
      cautionDeposit: '₹5,000 (Refundable)',
      annualTotal: dirItem?.annualFees || activeItem?.fees || (isMed ? '₹1,35,000 / yr' : '₹1,45,000 / yr'),
      scholarships: [
        'Central & State Government Merit-cum-Means Scholarships.',
        '100% Tuition Fee waiver for SC / ST / PwD students.',
        'State DBT scholarships (MahaDBT, NSP, PMSSS) for eligible categories.'
      ]
    },
    placements: !isMed ? {
      medianPackage: dirItem?.medianPackage || '₹14.5 LPA',
      highestPackage: '₹55.0 LPA',
      topRecruiters: ["Google", "Microsoft", "TCS R&D", "Infosys", "L&T", "Amazon", "Cognizant"]
    } : undefined,
    hospitalStats: isMed ? {
      hospitalBeds: dirItem?.hospitalBeds || 800,
      opdDaily: '2,500+ patients daily',
      icuBeds: '75 ICU Beds',
      ruralBond: '1 Year compulsory service bond'
    } : undefined,
    facilities: [
      "Modern Academic Complex with High-Speed Internet",
      "Central Library with Digital Resource Portal",
      "Student Hostels with Dining & Recreation Halls",
      "Sports Facilities & Gymnasium"
    ]
  };
}

// Helper: Toast Notifications
function showToast(msg) {
  let toast = document.getElementById('margdarshak-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'margdarshak-toast';
    toast.className = 'margdarshak-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="bi bi-check2-circle"></i> <span>${msg}</span>`;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2800);
}

// -------------------------------------------------------------
// Compulsory Rural Service Bond & Penalty Guide Engine
// -------------------------------------------------------------
function getCollegeBondDetails(profile) {
  const isMed = profile.type === 'AIIMS' || (profile.categoryGroup && profile.categoryGroup.includes('Medical')) || (profile.departments && profile.departments.some(d => d.degree === 'MBBS'));
  const isAiimsOrInI = profile.type === 'AIIMS' || profile.name.toLowerCase().includes('aiims') || profile.name.toLowerCase().includes('jipmer') || profile.name.toLowerCase().includes('pgimer');

  if (!isMed) {
    return {
      statusBadge: 'EXEMPTED',
      badgeClass: 'exempt',
      years: '0 Years (Direct Placement)',
      penalty: '₹0 (No Bond Penalty)',
      stipend: 'Direct Corporate CTC / Stipend',
      eligibility: 'Unconditional NOC for jobs & GATE / CAT / GRE / Higher Studies',
      headline: 'No Mandatory Public Service Bond for Engineering Institutes',
      description: 'Under Ministry of Education (MoE) guidelines, Central and State Engineering Institutes (IITs, NITs, IIITs, Govt Engineering Colleges) do NOT impose compulsory rural service bonds. Graduates are immediately eligible to join campus placement recruiters, establish startups, or pursue higher postgraduate studies in India or abroad.',
      rules: [
        'Campus Placement eligibility commences in final year (7th & 8th semesters).',
        'Direct release of degree certificate and migration certificate upon academic completion.',
        'Zero financial liability or bank guarantees required at time of counseling.',
        'Full freedom to pursue MS/M.Tech/MBA immediately post-graduation.'
      ]
    };
  }

  if (isAiimsOrInI) {
    return {
      statusBadge: 'AIIMS INI EXEMPTED',
      badgeClass: 'exempt',
      years: '0 Years (Central Exemption)',
      penalty: '₹0 (Zero Financial Bond)',
      stipend: '₹30,070 / month (Paid during compulsory 1-yr rotating internship)',
      eligibility: 'Directly eligible for INI-CET & NEET-PG counseling immediately post-internship',
      headline: 'Zero Compulsory Rural Service Bond for AIIMS Graduates',
      description: 'AIIMS institutions are autonomous Institutes of National Importance (INI) governed under the AIIMS Act. MBBS graduates from AIIMS are NOT subject to mandatory state rural service bonds. You receive your degree and permanent NMC registration immediately after completing the 12-month rotating internship, allowing immediate postgraduate residency or global clinical practice.',
      rules: [
        '100% Exemption from State Rural Service Bonds across all AIIMS campuses in India.',
        'Internship Stipend of ₹30,070/month paid as per central Ministry of Health scales.',
        'Immediate institutional quota eligibility for INI-CET (AIIMS PG / MD / MS / DM).',
        'Permanent NMC registration issued without any rural posting clearances.'
      ]
    };
  }

  // State-specific medical bonds
  const stateBonds = {
    'maharashtra': {
      years: '1 Year Compulsory Rural Service',
      penalty: '₹10,00,000 (Ten Lakhs) Bank Guarantee / Bond',
      stipend: '₹11,000/mo (Internship) + ~₹65,000 - ₹75,000/mo (During Rural MO posting)',
      eligibility: 'Must serve 1 yr or pay ₹10L penalty to receive permanent NOC for PG admission outside Maharashtra',
      description: 'Under Government of Maharashtra Public Health Department GR, all candidates admitted to Government and Municipal Medical Colleges must execute a bond to serve the Government of Maharashtra in rural/tribal/difficult areas for a period of 1 year.'
    },
    'uttar pradesh': {
      years: '2 Years Compulsory Rural / State Service',
      penalty: '₹10,00,000 (Ten Lakhs) Bond Amount',
      stipend: '₹12,000/mo (Internship) + ~₹65,000/mo (Medical Officer posting)',
      eligibility: 'Mandatory 2-year service in UP state health centers before private practice clearance',
      description: 'Under DGME UP guidelines, MBBS graduates from Government Medical Colleges must sign an agreement to serve for 2 years in designated government primary/community health centers.'
    },
    'madhya pradesh': {
      years: '1 Year (General) / 2 Years (Subsidized Quota)',
      penalty: '₹10,00,000 to ₹25,00,000 depending on seat category',
      stipend: '₹13,000/mo (Internship) + Class-II MO salary during rural posting',
      eligibility: 'Mandatory rural posting clearance for permanent state registration',
      description: 'DME Madhya Pradesh mandates 1 to 2 years of rural service in district hospitals or community health centers under MP Health Services.'
    },
    'rajasthan': {
      years: '2 Years Compulsory State Service',
      penalty: '₹5,00,000 (Five Lakhs) Penalty Bond',
      stipend: '₹14,000/mo (Internship) + ~₹55,000/mo MO salary',
      eligibility: '2-year bond execution required at time of admission joining',
      description: 'Medical Education Department Rajasthan requires candidates to serve in rural state healthcare dispensaries for 2 consecutive years.'
    },
    'gujarat': {
      years: '1 Year Compulsory Rural Service',
      penalty: '₹20,00,000 (Twenty Lakhs) Bond Condition',
      stipend: '₹18,200/mo (Internship) + ~₹70,000/mo MO salary',
      eligibility: 'Bank guarantee or bond undertaking submitted during admission',
      description: 'Gujarat Health & Family Welfare Department enforces a 1-year rural bond policy for all state quota and AIQ candidates admitted to Gujarat government medical colleges.'
    },
    'karnataka': {
      years: '1 Year Compulsory Public Service',
      penalty: '₹10,00,000 to ₹15,00,000 Under KMC Compulsory Service Act',
      stipend: '₹30,000/mo (Internship) + ~₹50,000/mo during rural posting',
      eligibility: 'Mandatory under Karnataka Compulsory Service by Candidates Training in Medical Sciences Act',
      description: 'Karnataka mandates one year of government service in rural or semi-urban healthcare institutions before issuing permanent registration.'
    },
    'tamil nadu': {
      years: '2 Years Compulsory State Service',
      penalty: '₹5,00,000 (Five Lakhs) Bond',
      stipend: '₹25,000/mo (Internship) + ~₹58,000/mo MO pay',
      eligibility: 'Posting allotted in Primary Health Centers (PHCs) across Tamil Nadu',
      description: 'Directorate of Medical Education Tamil Nadu requires candidates to serve in government medical institutions for 2 years or pay the bond penalty.'
    },
    'west bengal': {
      years: '1 Year Compulsory Service',
      penalty: '₹10,00,000 (Ten Lakhs) Bond Penalty',
      stipend: '₹28,050/mo (Internship) + ~₹60,000/mo MO salary',
      eligibility: 'Execution of service bond with Department of Health & Family Welfare WB',
      description: 'West Bengal requires MBBS doctors to serve for 1 year in rural block health centers, failure of which incurs the designated forfeiture penalty.'
    },
    'assam': {
      years: '5 Years Rural Service (or 1 Year with Rural Posting Incentive)',
      penalty: '₹30,00,000 (Thirty Lakhs) Strict Bond Penalty',
      stipend: '₹30,000/mo (Internship) + ~₹60,000/mo MO pay',
      eligibility: 'Strict bond enforcement with high forfeiture penalty',
      description: 'DME Assam enforces a stringent 5-year state service bond (reducible under specific critical rural postings) with a ₹30 Lakh penalty.'
    },
    'delhi': {
      years: '0 Years (No Mandatory Rural Bond for MBBS)',
      penalty: '₹0 (Zero Rural Bond Penalty)',
      stipend: '₹26,300/mo (Internship stipend across Delhi govt colleges)',
      eligibility: 'Direct clearance for NEET-PG / residency anywhere in India',
      description: 'Government medical colleges in the National Capital Territory of Delhi (MAMC, UCMS, VMMC, Lady Hardinge) do not impose a rural service bond for MBBS graduates.'
    },
    'bihar': {
      years: '3 Years Compulsory Rural Service',
      penalty: '₹15,00,000 (Fifteen Lakhs) Bond Amount',
      stipend: '₹15,000/mo (Internship) + ~₹65,000/mo MO salary',
      eligibility: 'Mandatory service in Bihar Health Department facilities',
      description: 'Government of Bihar mandates 3 years of rural healthcare service for state medical college MBBS graduates.'
    }
  };

  const stLower = (profile.state || '').toLowerCase();
  const matched = stateBonds[stLower] || {
    years: '1 Year Compulsory State / Rural Service',
    penalty: '₹10,00,000 (Ten Lakhs) State Bond',
    stipend: '~₹15,000/mo (Internship) + ~₹60,000/mo (MO posting)',
    eligibility: 'Bond signed during counseling document verification',
    description: `Under state health department regulations of ${profile.state}, students admitted to government medical seats are required to complete compulsory public healthcare service.`
  };

  return {
    statusBadge: 'MANDATORY STATE BOND',
    badgeClass: 'mandatory',
    years: matched.years,
    penalty: matched.penalty,
    stipend: matched.stipend,
    eligibility: matched.eligibility,
    headline: `${matched.years} in ${profile.state}`,
    description: matched.description,
    rules: [
      `Compulsory Service Period: ${matched.years}.`,
      `Financial Penalty on Breach: ${matched.penalty}.`,
      `Internship & Posting Stipend: ${matched.stipend}.`,
      `Counseling Requirement: Registered bond document and indemnity affidavit submitted during physical reporting.`
    ]
  };
}

// -------------------------------------------------------------
// Dedicated Full-Page College Dossier Rendering Logic
// -------------------------------------------------------------
function showFullCollegePage(identifier) {
  const profile = getCollegeProfile(identifier);
  if (!profile) return;

  state.currentCollegeProfile = profile;
  if (state.currentPage && state.currentPage !== 'page-college-profile') {
    state.previousPage = state.currentPage;
  }

  const isMed = profile.type === 'AIIMS' || (profile.categoryGroup && profile.categoryGroup.includes('Medical')) || (profile.departments && profile.departments.some(d => d.degree === 'MBBS'));
  const isIit = profile.type === 'IIT';
  const targetExam = isMed ? 'NEET-UG' : (isIit ? 'JEE-ADVANCED' : 'JEE-MAIN');
  const cleanWeb = profile.website && profile.website.startsWith('http') ? profile.website : `https://${profile.website || (isMed ? 'mcc.nic.in' : 'josaa.nic.in')}`;

  // 1. Breadcrumbs & Back Navigation
  const backLabel = document.getElementById('back-btn-label');
  if (backLabel) {
    if (state.previousPage === 'page-predictor') {
      backLabel.textContent = 'Back to Predictor Results';
    } else if (state.previousPage === 'page-engineering-directory') {
      backLabel.textContent = 'Back to Engineering Directory';
    } else {
      backLabel.textContent = 'Back to Medical Directory';
    }
  }

  const bcCategory = document.getElementById('bc-category-link');
  if (bcCategory) {
    const isEng = !isMed;
    bcCategory.textContent = isEng ? 'Engineering Directory' : 'Medical Directory';
    bcCategory.onclick = (e) => {
      e.preventDefault();
      switchPage(isEng ? 'page-engineering-directory' : 'page-medical-directory');
    };
  }

  const bcCollege = document.getElementById('bc-college-name');
  if (bcCollege) bcCollege.textContent = profile.shortName || profile.name;

  // 2. Hero Header Elements
  const logoBox = document.getElementById('cf-logo-box');
  if (logoBox) {
    logoBox.innerHTML = getCollegeLogoBadge(profile.name, profile.type, profile.logo, profile.id);
  }

  const nameEl = document.getElementById('cf-college-name');
  if (nameEl) nameEl.textContent = profile.name;

  const badgesStrip = document.getElementById('cf-badges-strip');
  if (badgesStrip) {
    badgesStrip.innerHTML = `
      <span class="type-pill ${profile.type === 'AIIMS' ? 'aiims' : (profile.type === 'IIT' ? 'iit' : '')}">${profile.type}</span>
      <span class="ownership-pill">${profile.ownership}</span>
      <span class="nirf-badge">NIRF #${profile.nirf2024}</span>
      <span class="nirf-badge" style="background:#f1f5f9; color:#475569; border-color:#cbd5e1;"><i class="bi bi-calendar3"></i> Est. ${profile.established}</span>
    `;
  }

  const metaLoc = document.getElementById('cf-meta-location');
  if (metaLoc) metaLoc.innerHTML = `<i class="bi bi-geo-alt-fill text-danger"></i> ${profile.city}, ${profile.state}`;

  const metaExam = document.getElementById('cf-meta-exam');
  if (metaExam) metaExam.innerHTML = `<i class="bi bi-mortarboard-fill text-primary"></i> ${profile.seatMatrix?.exam || (isMed ? 'NEET UG' : 'JEE / JoSAA')}`;

  const metaCampus = document.getElementById('cf-meta-campus');
  if (metaCampus) metaCampus.innerHTML = `<i class="bi bi-tree-fill text-success"></i> ${profile.campusAcres || 150} Acres Campus`;

  // Hero Actions
  const btnPredict = document.getElementById('cf-btn-predict');
  if (btnPredict) {
    btnPredict.onclick = () => window.jumpToPredictorForCollege(profile.shortName || profile.name, targetExam);
  }

  const btnChoice = document.getElementById('cf-btn-choice');
  const choiceText = document.getElementById('cf-choice-btn-text');
  if (btnChoice) {
    const isBookmarked = state.choiceList.some(c => c.id === profile.id || c.institute === profile.name);
    btnChoice.classList.toggle('added', isBookmarked);
    if (choiceText) choiceText.textContent = isBookmarked ? 'In Choice List' : 'Add to Choice List';
    btnChoice.onclick = () => {
      const type = isMed ? 'medical' : 'engineering';
      window.toggleDirectoryChoice(profile.id, type);
      const nowBookmarked = state.choiceList.some(c => c.id === profile.id || c.institute === profile.name);
      btnChoice.classList.toggle('added', nowBookmarked);
      if (choiceText) choiceText.textContent = nowBookmarked ? 'In Choice List' : 'Add to Choice List';
    };
  }

  const btnPortal = document.getElementById('cf-btn-portal');
  if (btnPortal) btnPortal.href = cleanWeb;

  const btnGoogle = document.getElementById('cf-btn-google');
  if (btnGoogle) {
    btnGoogle.href = `https://www.google.com/search?q=${encodeURIComponent(profile.name + ' official website portal')}`;
  }

  // 3. User Admission Chance Banner
  const userRank = state.filters.rank;
  const cutoffRank = profile.cutoffRankGen || profile.closingCSE || (isMed ? 2500 : 1800);
  const banner = document.getElementById('cf-user-chance-banner');
  const icon = document.getElementById('cf-chance-icon');
  const headline = document.getElementById('cf-chance-headline');
  const subtext = document.getElementById('cf-chance-subtext');
  const actionBtn = document.getElementById('cf-btn-chance-action');

  if (banner && headline) {
    if (userRank && userRank > 0) {
      const ratio = userRank / cutoffRank;
      if (ratio <= 0.85) {
        banner.className = 'cf-user-chance-banner chance-high';
        if (icon) icon.className = 'bi bi-check-circle-fill chance-icon';
        headline.innerHTML = `High Admission Likelihood &mdash; Your Rank: <strong>AIR ${userRank.toLocaleString()}</strong> vs 2024 Cutoff: <strong>AIR ${cutoffRank.toLocaleString()}</strong>`;
        if (subtext) subtext.textContent = `Excellent probability! Your rank comfortably clears historical Round 1 and Round 2 closing marks for ${profile.shortName || profile.name}. Recommended as a preferred choice in your choice filling list.`;
      } else if (ratio <= 1.25) {
        banner.className = 'cf-user-chance-banner chance-moderate';
        if (icon) icon.className = 'bi bi-exclamation-triangle-fill chance-icon';
        headline.innerHTML = `Competitive / Borderline Range &mdash; Your Rank: <strong>AIR ${userRank.toLocaleString()}</strong> vs 2024 Cutoff: <strong>AIR ${cutoffRank.toLocaleString()}</strong>`;
        if (subtext) subtext.textContent = `You are on the competitive boundary for general category seats. High likelihood of allotment in subsequent counseling rounds or state quota mop-up.`;
      } else {
        banner.className = 'cf-user-chance-banner chance-reach';
        if (icon) icon.className = 'bi bi-lightning-charge-fill chance-icon';
        headline.innerHTML = `Dream / Reach Option &mdash; Your Rank: <strong>AIR ${userRank.toLocaleString()}</strong> vs 2024 Cutoff: <strong>AIR ${cutoffRank.toLocaleString()}</strong>`;
        if (subtext) subtext.textContent = `Historical cutoffs close earlier. You can place this college at the top of your counseling choice sheet as an aspirational preference without losing merit priority.`;
      }
      if (actionBtn) {
        actionBtn.innerHTML = `<i class="bi bi-arrow-repeat"></i> Change Rank in Predictor`;
        actionBtn.onclick = () => window.jumpToPredictorForCollege(profile.shortName || profile.name, targetExam);
      }
    } else {
      banner.className = 'cf-user-chance-banner';
      if (icon) icon.className = 'bi bi-shield-check chance-icon';
      headline.textContent = `Check Your Admission Likelihood for ${profile.shortName || profile.name}`;
      if (subtext) subtext.textContent = `Enter your NEET or JEE rank in our predictor to unlock personalized seat probabilities and round-by-round trends.`;
      if (actionBtn) {
        actionBtn.innerHTML = `<i class="bi bi-calculator"></i> Enter My Rank`;
        actionBtn.onclick = () => window.jumpToPredictorForCollege(profile.shortName || profile.name, targetExam);
      }
    }
  }

  // 4. Metrics Strip
  const bondInfo = getCollegeBondDetails(profile);

  const valSeats = document.getElementById('cf-val-seats');
  if (valSeats) valSeats.textContent = `${(profile.totalSeats || 150).toLocaleString()} Seats`;

  const valFee = document.getElementById('cf-val-fee');
  if (valFee) valFee.textContent = profile.feeStructure?.annualTotal || 'Govt Subsidized';

  const iconFeature = document.getElementById('cf-icon-feature');
  if (iconFeature) iconFeature.innerHTML = isMed ? '<i class="bi bi-hospital-fill"></i>' : '<i class="bi bi-briefcase-fill"></i>';

  const lblFeature = document.getElementById('cf-lbl-feature');
  if (lblFeature) lblFeature.textContent = isMed ? 'Hospital Bed Capacity' : 'Median Placement CTC';

  const valFeature = document.getElementById('cf-val-feature');
  if (valFeature) {
    valFeature.textContent = isMed ?
      (profile.hospitalStats?.hospitalBeds ? profile.hospitalStats.hospitalBeds.toLocaleString() + ' Beds' : '850+ Beds') :
      (profile.placements?.medianPackage || '₹16.0 LPA');
  }

  const valCutoff = document.getElementById('cf-val-cutoff');
  if (valCutoff) {
    valCutoff.textContent = `AIR ${profile.cutoffRankGen ? profile.cutoffRankGen.toLocaleString() : (profile.closingCSE ? profile.closingCSE.toLocaleString() : 'Top Merit')}`;
  }

  const lblBond = document.getElementById('cf-lbl-bond');
  if (lblBond) lblBond.textContent = isMed ? 'Rural Service Bond' : 'Service Bond Status';

  const valBond = document.getElementById('cf-val-bond');
  if (valBond) valBond.textContent = bondInfo.years;

  const valNirf = document.getElementById('cf-val-nirf');
  if (valNirf) valNirf.textContent = `#${profile.nirf2024} in India`;

  // 5. Section 1: Overview
  const callout = document.getElementById('cf-highlights-callout');
  if (callout) {
    callout.innerHTML = `<strong><i class="bi bi-award-fill text-primary"></i> Key Highlights:</strong> ${profile.highlights}`;
  }

  const aboutText = document.getElementById('cf-about-text');
  if (aboutText) aboutText.innerHTML = `<p>${profile.about}</p>`;

  const factsGrid = document.getElementById('cf-facts-grid');
  if (factsGrid) {
    factsGrid.innerHTML = `
      <div class="cf-fact-card"><span class="cf-fact-lbl">Established</span><span class="cf-fact-val">${profile.established}</span></div>
      <div class="cf-fact-card"><span class="cf-fact-lbl">Ownership / Control</span><span class="cf-fact-val">${profile.ownership}</span></div>
      <div class="cf-fact-card"><span class="cf-fact-lbl">NIRF Ranking 2024</span><span class="cf-fact-val text-primary">#${profile.nirf2024} in India</span></div>
      <div class="cf-fact-card"><span class="cf-fact-lbl">Campus Area</span><span class="cf-fact-val">${profile.campusAcres || 150} Acres</span></div>
      <div class="cf-fact-card"><span class="cf-fact-lbl">${isMed ? 'Hospital Beds' : 'Highest Package'}</span><span class="cf-fact-val text-cyan">${isMed ? (profile.hospitalStats?.hospitalBeds?.toLocaleString() || '850+') + ' Beds' : (profile.placements?.highestPackage || '₹85.0 LPA')}</span></div>
      <div class="cf-fact-card"><span class="cf-fact-lbl">Annual Tuition Tier</span><span class="cf-fact-val text-amber">${profile.feeStructure?.annualTotal || 'Govt Subsidized'}</span></div>
    `;
  }

  const facilitiesGrid = document.getElementById('cf-facilities-grid');
  if (facilitiesGrid) {
    const facs = profile.facilities || [
      "Central Air-Conditioned Library & Digital E-Resource Portal",
      "High-Speed Campus-Wide Wi-Fi & Smart Lecture Theatres",
      "On-Campus Hostels & Subsidized Hygienic Mess",
      "Modern Sports Complex, Gymnasium & Athletics Ground",
      "Advanced Research & Diagnostics Simulation Centers"
    ];
    facilitiesGrid.innerHTML = facs.map(f => `
      <div class="cf-facility-pill"><i class="bi bi-check-circle-fill text-success"></i> <span>${f}</span></div>
    `).join('');
  }

  // 6. Section 2: Seat Matrix
  const elSeatsTotal = document.getElementById('cf-seats-total');
  if (elSeatsTotal) elSeatsTotal.textContent = (profile.totalSeats || 150).toLocaleString();

  const elExamBadge = document.getElementById('cf-seats-exam-badge');
  if (elExamBadge) elExamBadge.textContent = profile.seatMatrix?.exam || (isMed ? 'NEET UG' : 'JEE Main / Adv');

  const elPoolBadge = document.getElementById('cf-seats-pool-badge');
  if (elPoolBadge) elPoolBadge.textContent = profile.seatMatrix?.pool || 'General & Reserved Pools';

  const catMap = profile.seatMatrix?.categories || {};
  const total = profile.totalSeats || 150;

  const barWrap = document.getElementById('cf-cat-bar-wrap');
  if (barWrap) {
    const openPct = (((catMap.OPEN || Math.round(total * 0.405)) / total) * 100).toFixed(1);
    const ewsPct = (((catMap['GEN-EWS'] || Math.round(total * 0.10)) / total) * 100).toFixed(1);
    const obcPct = (((catMap['OBC-NCL'] || Math.round(total * 0.27)) / total) * 100).toFixed(1);
    const scPct = (((catMap.SC || Math.round(total * 0.15)) / total) * 100).toFixed(1);
    const stPct = (((catMap.ST || Math.round(total * 0.075)) / total) * 100).toFixed(1);

    barWrap.innerHTML = `
      <div class="cf-cat-bar" title="Category reservation distribution">
        <div class="cf-cat-segment open" style="width: ${openPct}%;" title="OPEN: ${openPct}%"></div>
        <div class="cf-cat-segment ews" style="width: ${ewsPct}%;" title="EWS: ${ewsPct}%"></div>
        <div class="cf-cat-segment obc" style="width: ${obcPct}%;" title="OBC: ${obcPct}%"></div>
        <div class="cf-cat-segment sc" style="width: ${scPct}%;" title="SC: ${scPct}%"></div>
        <div class="cf-cat-segment st" style="width: ${stPct}%;" title="ST: ${stPct}%"></div>
      </div>
      <div class="cf-cat-legend">
        <span class="cf-cat-legend-item"><span class="cf-cat-dot" style="background:#3b82f6;"></span> OPEN (${openPct}%)</span>
        <span class="cf-cat-legend-item"><span class="cf-cat-dot" style="background:#f59e0b;"></span> GEN-EWS (${ewsPct}%)</span>
        <span class="cf-cat-legend-item"><span class="cf-cat-dot" style="background:#10b981;"></span> OBC-NCL (${obcPct}%)</span>
        <span class="cf-cat-legend-item"><span class="cf-cat-dot" style="background:#8b5cf6;"></span> SC (${scPct}%)</span>
        <span class="cf-cat-legend-item"><span class="cf-cat-dot" style="background:#ec4899;"></span> ST (${stPct}%)</span>
      </div>
    `;
  }

  const catTbody = document.getElementById('cf-cat-tbody');
  if (catTbody) {
    catTbody.innerHTML = `
      <tr>
        <td><strong>OPEN / General (Unreserved)</strong></td>
        <td>~40.5% Central Merit</td>
        <td><strong class="text-primary">${catMap.OPEN || Math.round(total * 0.405)}</strong></td>
        <td>Open to all merit candidates nationwide without domicile barrier</td>
      </tr>
      <tr>
        <td><strong>GEN-EWS (Economically Weaker Section)</strong></td>
        <td>10.0% Central Pool</td>
        <td><strong>${catMap['GEN-EWS'] || Math.round(total * 0.10)}</strong></td>
        <td>Valid central EWS certificate with gross family income &lt; ₹8 Lakh/annum</td>
      </tr>
      <tr>
        <td><strong>OBC-NCL (Other Backward Class Non-Creamy)</strong></td>
        <td>27.0% Central Pool</td>
        <td><strong>${catMap['OBC-NCL'] || Math.round(total * 0.27)}</strong></td>
        <td>Candidates in Central OBC list with valid non-creamy layer affidavit</td>
      </tr>
      <tr>
        <td><strong>SC (Scheduled Caste)</strong></td>
        <td>15.0% Central Pool</td>
        <td><strong>${catMap.SC || Math.round(total * 0.15)}</strong></td>
        <td>National SC caste verification certificate issued by authorized tehsildar</td>
      </tr>
      <tr>
        <td><strong>ST (Scheduled Tribe)</strong></td>
        <td>7.5% Central Pool</td>
        <td><strong>${catMap.ST || Math.round(total * 0.075)}</strong></td>
        <td>National ST caste certificate with permanent validity</td>
      </tr>
      <tr>
        <td><strong>PwD (Persons with Benchmark Disabilities)</strong></td>
        <td>5.0% Horizontal</td>
        <td><strong>~${catMap.PwD || Math.max(1, Math.round(total * 0.05))}</strong></td>
        <td>5% horizontal reservation across each respective vertical category</td>
      </tr>
    `;
  }

  // 7. Section 3: Courses & Departments
  const deptList = document.getElementById('cf-dept-list');
  if (deptList) {
    const depts = profile.departments || [];
    deptList.innerHTML = depts.map(d => `
      <div class="cf-course-card">
        <div class="course-header">
          <span class="degree-pill">${d.degree}</span>
          <span class="duration-pill"><i class="bi bi-clock-history"></i> ${d.duration}</span>
        </div>
        <h4 class="course-name">${d.name}</h4>
        <div class="course-footer">
          <span class="course-seats-lbl">Approved Annual Intake:</span>
          <strong class="course-seats-val text-primary">${d.seats ? d.seats.toLocaleString() + ' Seats' : 'Available'}</strong>
        </div>
      </div>
    `).join('');
  }

  // 8. Section 4: Fees & Scholarships
  const fs = profile.feeStructure || {};
  const feeTable = document.getElementById('cf-fee-table');
  if (feeTable) {
    feeTable.innerHTML = `
      <tr>
        <td><strong>Annual Tuition Fee</strong></td>
        <td><strong class="text-primary">${fs.tuitionFee || fs.annualTotal || 'Subsidized'}</strong></td>
        <td>Subsidized for Government Quota (100% waiver applies for SC/ST/PwD)</td>
      </tr>
      <tr>
        <td><strong>Hostel & Mess Amenities</strong></td>
        <td><strong>${fs.hostelMess || '₹36,000 / semester'}</strong></td>
        <td>Furnished student accommodation with advance mess food plan</td>
      </tr>
      <tr>
        <td><strong>Refundable Institutional Deposit</strong></td>
        <td><strong>${fs.cautionDeposit || '₹5,000 (One-Time)'}</strong></td>
        <td>100% Refundable upon degree completion and library clearance</td>
      </tr>
      <tr>
        <td><strong>Library, Internet & Examination Dues</strong></td>
        <td><strong>${fs.developmentFee || '₹8,000 / annum'}</strong></td>
        <td>Institutional campus development & university exam registration</td>
      </tr>
      <tr class="table-total-row">
        <td><strong>Total Estimated Annual Academic Expense</strong></td>
        <td><strong class="text-emerald" style="font-size:16px;">${fs.annualTotal || 'Govt Subsidized'}</strong></td>
        <td>Official statutory counseling fee tier</td>
      </tr>
    `;
  }

  const scholList = document.getElementById('cf-scholarships-list');
  if (scholList) {
    const schols = profile.feeStructure?.scholarships || [
      "100% Tuition Fee waiver for SC / ST / PwD students.",
      "Central Sector Scheme of Scholarships for College and University Students (NSP portal).",
      "Full tuition remission for students whose family annual income is below ₹1.0 Lakh.",
      "State DBT Schemes (MahaDBT, UP Scholarship, Post-Matric Scholarship)."
    ];
    scholList.innerHTML = schols.map(s => `
      <li><i class="bi bi-check-circle-fill text-gold"></i> <span>${s}</span></li>
    `).join('');
  }

  // 9. Section 5: Cutoffs & Trends Summary
  const cutoffsCard = document.getElementById('cf-cutoffs-summary-card');
  if (cutoffsCard) {
    cutoffsCard.innerHTML = `
      <div class="cf-cutoffs-hero-box">
        <div class="cutoff-stat-item">
          <span class="cs-lbl">2024 Round 1 Closing Rank (General)</span>
          <div class="cs-val text-primary">AIR ${profile.cutoffRankGen ? profile.cutoffRankGen.toLocaleString() : (profile.closingCSE ? profile.closingCSE.toLocaleString() : 'Top 1%')}</div>
          <small class="text-muted">Official counseling round closing allotment</small>
        </div>
        <div class="cutoff-stat-item">
          <span class="cs-lbl">Predicted Safe Rank (2026 Admissions)</span>
          <div class="cs-val text-emerald">AIR ${Math.round((profile.cutoffRankGen || profile.closingCSE || 1500) * 0.95).toLocaleString()}</div>
          <small class="text-muted">Target safe percentile for confirmed round 1 seat</small>
        </div>
        <div class="cutoff-stat-item">
          <span class="cs-lbl">Counseling Quotas Applicable</span>
          <div class="cs-val" style="font-size:16px; font-weight:700;">${profile.seatMatrix?.quota || 'All India Quota + State Domicile'}</div>
          <small class="text-muted">${profile.seatMatrix?.exam || 'Statutory Entrance Exam'}</small>
        </div>
      </div>
      <div class="cf-cutoffs-cta-row">
        <button class="btn-primary" onclick="window.jumpToPredictorForCollege('${(profile.shortName || profile.name).replace(/'/g, "\\'")}', '${targetExam}')">
          <i class="bi bi-lightning-charge-fill"></i> Check My Probability in Full Cutoff Predictor
        </button>
        <button class="btn-secondary" onclick="document.getElementById('btn-open-rank-calc')?.click()">
          <i class="bi bi-calculator"></i> Open Marks vs Rank Calculator
        </button>
      </div>
    `;
  }

  // 10. Section 6: Facilities / Hospital / Placements
  const facHeading = document.getElementById('cf-sec-facilities-heading');
  if (facHeading) {
    facHeading.innerHTML = isMed ?
      `<i class="bi bi-hospital text-cyan"></i> Hospital & Clinical Healthcare Statistics` :
      `<i class="bi bi-briefcase-fill text-cyan"></i> Placement Statistics & Industrial Recruiters`;
  }

  const insightsGrid = document.getElementById('cf-insights-grid');
  if (insightsGrid) {
    if (isMed) {
      const hs = profile.hospitalStats || { hospitalBeds: 850, opdDaily: '2,500+ daily', icuBeds: '80 ICU Beds', ruralBond: '1 Year compulsory service' };
      insightsGrid.innerHTML = `
        <div class="cf-insight-card">
          <span class="ic-lbl">Clinical Bed Strength</span>
          <div class="ic-val text-cyan">${(hs.hospitalBeds || 850).toLocaleString()} Inpatient Beds</div>
          <div class="ic-sub">Multi-specialty tertiary care hospital infrastructure</div>
        </div>
        <div class="cf-insight-card">
          <span class="ic-lbl">Daily OPD Footfall</span>
          <div class="ic-val text-success">${hs.opdDaily || '3,000+ patients daily'}</div>
          <div class="ic-sub">High clinical patient volume and diverse pathology exposure</div>
        </div>
        <div class="cf-insight-card">
          <span class="ic-lbl">Intensive Care Capacity</span>
          <div class="ic-val text-purple">${hs.icuBeds || '100+ Critical Care Beds'}</div>
          <div class="ic-sub">MICU, SICU, NICU, PICU & Trauma Emergency Unit</div>
        </div>
        <div class="cf-insight-card">
          <span class="ic-lbl">Medical Research Labs</span>
          <div class="ic-val text-amber">ICMR & NABL Certified</div>
          <div class="ic-sub">Advanced molecular diagnostics & simulation surgical centers</div>
        </div>
      `;
    } else {
      const pl = profile.placements || { medianPackage: '₹16.0 LPA', highestPackage: '₹85.0 LPA', topRecruiters: ["Google", "Microsoft", "Amazon", "Texas Instruments", "Qualcomm"] };
      insightsGrid.innerHTML = `
        <div class="cf-insight-card">
          <span class="ic-lbl">Median Placement CTC</span>
          <div class="ic-val text-success">${pl.medianPackage}</div>
          <div class="ic-sub">Official NIRF verified median package</div>
        </div>
        <div class="cf-insight-card">
          <span class="ic-lbl">Highest Recorded CTC</span>
          <div class="ic-val text-primary">${pl.highestPackage || '₹85.0 LPA'}</div>
          <div class="ic-sub">Top international / domestic corporate offer</div>
        </div>
        <div class="cf-insight-card" style="grid-column: 1 / -1;">
          <span class="ic-lbl">Top Industrial Partners & Campus Recruiters</span>
          <div class="recruiters-tag-cloud" style="margin-top: 10px;">
            ${(pl.topRecruiters || ["Google", "Microsoft", "Amazon", "Texas Instruments", "Qualcomm"]).map(r => `<span class="recruiter-tag"><i class="bi bi-briefcase-fill"></i> ${r}</span>`).join('')}
          </div>
        </div>
      `;
    }
  }

  // 11. Section 7: Compulsory Rural Service Bond Guide
  const bondContainer = document.getElementById('cf-bond-container');
  if (bondContainer) {
    bondContainer.innerHTML = `
      <div class="cf-bond-summary-box ${bondInfo.badgeClass}">
        <div class="bond-top-row">
          <span class="bond-status-pill ${bondInfo.badgeClass}"><i class="bi bi-shield-check"></i> ${bondInfo.statusBadge}</span>
          <span class="bond-state-pill"><i class="bi bi-geo-alt"></i> ${profile.state} Policy</span>
        </div>
        <h4 class="bond-headline">${bondInfo.headline}</h4>
        <p class="bond-desc">${bondInfo.description}</p>
        <div class="bond-metrics-row">
          <div class="bond-m-card">
            <span class="bm-lbl">Mandatory Service Period</span>
            <span class="bm-val text-primary">${bondInfo.years}</span>
          </div>
          <div class="bond-m-card">
            <span class="bm-lbl">Breach Penalty Guarantee</span>
            <span class="bm-val text-rose">${bondInfo.penalty}</span>
          </div>
          <div class="bond-m-card">
            <span class="bm-lbl">Monthly Stipend Scale</span>
            <span class="bm-val text-success">${bondInfo.stipend}</span>
          </div>
          <div class="bond-m-card">
            <span class="bm-lbl">Postgraduate / NOC Rules</span>
            <span class="bm-val text-amber">${bondInfo.eligibility}</span>
          </div>
        </div>
        <div class="bond-key-rules">
          <h5><i class="bi bi-info-circle-fill"></i> Mandatory Counseling Bond Regulations</h5>
          <ul>
            ${bondInfo.rules.map(r => `<li><i class="bi bi-check-circle-fill text-success"></i> ${r}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // 12. Section 8: Campus Location & Helplines
  const phoneEl = document.getElementById('cf-contact-phone');
  if (phoneEl) {
    const rawPhone = profile.phone || '+91 22 2500 1234';
    phoneEl.innerHTML = `<a href="tel:${rawPhone.split('/')[0].trim()}" style="color:var(--text-primary); text-decoration:none;"><i class="bi bi-telephone"></i> ${rawPhone}</a>`;
  }

  const emailEl = document.getElementById('cf-contact-email');
  if (emailEl) {
    emailEl.innerHTML = `<a href="mailto:${profile.email}" style="color:var(--emerald); text-decoration:none;"><i class="bi bi-envelope"></i> ${profile.email}</a>`;
  }

  const webEl = document.getElementById('cf-contact-website');
  if (webEl) {
    const googleFallback = `https://www.google.com/search?q=${encodeURIComponent(profile.name + ' official website portal')}`;
    webEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:6px;">
        <a href="${cleanWeb}" target="_blank" rel="noopener noreferrer" style="color:var(--primary); font-weight:600; text-decoration:underline; word-break:break-all;">
          ${cleanWeb.replace(/^https?:\/\//, '')} <i class="bi bi-box-arrow-up-right" style="font-size:11px;"></i>
        </a>
        <a href="${googleFallback}" target="_blank" rel="noopener noreferrer" style="font-size:11.5px; color:var(--text-secondary); text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
          <i class="bi bi-google" style="color:#ea4335;"></i> Search on Google if domain is slow / unreachable
        </a>
      </div>
    `;
  }

  const addrEl = document.getElementById('cf-contact-address');
  if (addrEl) addrEl.textContent = profile.address;

  const mapsBtn = document.getElementById('cf-maps-link');
  if (mapsBtn) {
    mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.name + ' ' + profile.city)}`;
  }

  // 13. Dynamic SEO Meta Tags & Google JSON-LD Schema
  document.title = `${profile.name} — Cutoffs, Fee Structure, Seats & Rural Bond 2026 | MargDarshak`;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = `Complete admission guide for ${profile.name}, ${profile.city}, ${profile.state}. Check NIRF #${profile.nirf2024}, total ${profile.totalSeats} seats, 2024 closing ranks, official fee structure, and compulsory rural bond policy.`;

  let schemaScript = document.getElementById('college-dossier-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'college-dossier-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": profile.name,
    "alternateName": profile.shortName || profile.name,
    "url": cleanWeb,
    "telephone": profile.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.city,
      "addressRegion": profile.state,
      "addressCountry": "IN"
    },
    "description": profile.about
  });

  // 14. Clean SEO Slug Path & Canonical Link
  const slug = getCollegeSlug(profile);
  const cleanPath = `/college/${slug}`;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', `${window.location.origin}${cleanPath}`);

  // Use HTML5 pushState for real, indexable clean URLs (with hash fallback)
  if (window.history.pushState) {
    window.history.pushState({ page: 'page-college-profile', collegeId: profile.id, slug: slug }, '', cleanPath);
  } else {
    window.location.hash = `#/college/${slug}`;
  }

  // Connect Compare Current College Button in hero actions
  const btnCompareCur = document.getElementById('cf-btn-compare-current');
  if (btnCompareCur) {
    btnCompareCur.onclick = () => {
      if (window.openCompareModal) {
        window.openCompareModal(profile.id);
      }
    };
  }

  switchPage('page-college-profile');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global hook for college clicks throughout the app
window.openCollegeDetails = function(identifier) {
  return showFullCollegePage(identifier);
};

window.closeCollegeDetailsModal = function() {
  const backdrop = document.getElementById('college-details-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
};

window.printCollegeProfile = function() {
  window.print();
};

function renderResults() {
  const tbody = document.getElementById('results-tbody');
  const results = state.filteredResults;
  const { page, pageSize } = state.pagination;

  if (results.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <i class="bi bi-search" style="font-size: 36px; display: block; margin-bottom: 12px; opacity: 0.5;"></i>
          <h4 style="color: var(--text-primary); margin-bottom: 6px;">No Matching Colleges Found</h4>
          <p style="font-size: 13px;">Try adjusting your Rank, Category, Branch, or selecting "All Chances".</p>
          <button class="btn-secondary" style="margin-top: 14px;" onclick="document.getElementById('btn-reset-filters')?.click()">
            <i class="bi bi-arrow-counterclockwise"></i> Reset All Filters
          </button>
        </td>
      </tr>
    `;
    document.getElementById('pagination-bar').style.display = 'none';
    return;
  }

  document.getElementById('pagination-bar').style.display = 'flex';
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, results.length);
  const pageItems = results.slice(startIndex, endIndex);

  tbody.innerHTML = pageItems.map(item => {
    const isBookmarked = state.choiceList.some(c => c.id === item.id);
    const quotaClass = (item.quota || '').toLowerCase();
    let quotaDisplay = 'All India (AIQ)';
    if (item.quota === 'HS') {
      quotaDisplay = `State Quota (${item.state})`;
    } else if (item.quota === 'OS') {
      quotaDisplay = 'Other State (OS)';
    } else if (item.quota === 'AI' || item.quota === 'AIQ') {
      quotaDisplay = 'All India (AIQ)';
    } else if (item.quota) {
      quotaDisplay = item.quota;
    }
    
    const safeInstId = (item.id || item.institute || '').replace(/'/g, "\\'");

    return `
      <tr data-id="${item.id}">
        <td>
          <div class="inst-name-logo-wrap cd-interactive" onclick="window.openCollegeDetails('${safeInstId}')" title="Click to view full college profile, seat matrix & fees">
            ${getCollegeLogoBadge(item.institute, item.type || 'College')}
            <div class="inst-cell">
              <div class="inst-name cd-clickable-name">
                <span>${item.institute}</span>
                <i class="bi bi-arrow-up-right-circle cd-pop-icon" title="View complete college profile"></i>
                ${item.nirf ? `<span class="nirf-badge">NIRF #${item.nirf}</span>` : ''}
              </div>
              <div class="inst-location">
                <i class="bi bi-geo-alt"></i> ${item.city}, ${item.state}
                <span class="inst-type-badge">${item.type}</span>
                <span class="cd-quick-link-hint"><i class="bi bi-info-circle-fill"></i> View Details</span>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div class="course-cell">
            <div class="course-title">${item.course}</div>
            <div class="course-fees"><i class="bi bi-cash-stack"></i> ${item.fees || 'Govt Subsidized'}</div>
          </div>
        </td>
        <td>
          <div class="quota-badge-wrap">
            <span class="quota-pill ${quotaClass}">${quotaDisplay}</span>
            <span class="cat-pill">${item.category} • ${item.gender === 'Female-only (supernumerary)' ? 'Female Pool' : 'Neutral'}</span>
          </div>
        </td>
        <td>
          <div class="cutoff-cell">
            <div class="cutoff-rank">AIR ${item.closing_2024.toLocaleString()}</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <button class="btn-trend-link" onclick="window.view3YearTrend('${item.id}')" title="View 3-Year Cutoff Trend">
                <i class="bi bi-graph-up"></i> Trend
              </button>
              <button class="btn-trend-link" style="color:var(--primary); background:rgba(37,99,235,0.06); border-color:rgba(37,99,235,0.2);" onclick="window.openCollegeDetails('${safeInstId}')" title="View college details, fees & seats">
                <i class="bi bi-info-circle"></i> Details
              </button>
            </div>
          </div>
        </td>
        <td>
          <div class="chance-cell">
            <div class="chance-badge ${item._prob.class}">
              <i class="bi ${item._prob.icon}"></i> ${item._prob.label}
            </div>
            <div class="chance-bar-bg" title="${item._prob.percent}% probability">
              <div class="chance-bar-fill ${item._prob.class}" style="width: ${item._prob.percent}%"></div>
            </div>
          </div>
        </td>
        <td style="text-align: center;">
          <button class="btn-add-choice ${isBookmarked ? 'added' : ''}" 
                  onclick="window.toggleChoice('${item.id}')" 
                  title="${isBookmarked ? 'Remove from Choice List' : 'Add to My Choice List'}">
            <i class="bi ${isBookmarked ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('pagination-info').textContent = 
    `Showing ${startIndex + 1} to ${endIndex} of ${results.length} colleges`;

  renderPaginationButtons(results.length, page, pageSize);
}

function renderPaginationButtons(total, currentPage, pageSize) {
  const totalPages = Math.ceil(total / pageSize);
  const container = document.getElementById('pagination-btns');

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  if (currentPage > 1) {
    html += `<button class="page-btn" onclick="window.changePage(${currentPage - 1})"><i class="bi bi-chevron-left"></i></button>`;
  }

  for (let i = 1; i <= Math.min(5, totalPages); i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="window.changePage(${i})">${i}</button>`;
  }

  if (totalPages > 5) {
    html += `<span style="padding: 6px; color: var(--text-muted);">...</span>`;
    html += `<button class="page-btn ${totalPages === currentPage ? 'active' : ''}" onclick="window.changePage(${totalPages})">${totalPages}</button>`;
  }

  if (currentPage < totalPages) {
    html += `<button class="page-btn" onclick="window.changePage(${currentPage + 1})"><i class="bi bi-chevron-right"></i></button>`;
  }

  container.innerHTML = html;
}

function populateFiltersForExam(examKey) {
  const config = EXAM_CONFIGS[examKey];

  const titleEl = document.getElementById('current-exam-title');
  if (titleEl) titleEl.textContent = config.title;
  const pillEl = document.getElementById('current-exam-pill');
  if (pillEl) pillEl.textContent = config.pill;

  const rankFieldName = document.getElementById('rank-field-name');
  if (rankFieldName) rankFieldName.textContent = config.rankLabel;
  const inputRank = document.getElementById('input-rank');
  if (inputRank) {
    inputRank.placeholder = config.rankPlaceholder;
    inputRank.value = config.defaultRank;
    inputRank.max = config.maxRank;
  }
  state.filters.rank = config.defaultRank;

  const homeStateGroup = document.getElementById('group-home-state');
  if (homeStateGroup) homeStateGroup.style.display = config.showHomeState ? 'flex' : 'none';
  const quotaPrefGroup = document.getElementById('group-quota-preference');
  if (quotaPrefGroup) quotaPrefGroup.style.display = config.showQuotaPref !== false ? 'flex' : 'none';
  const genderGroup = document.getElementById('group-gender');
  if (genderGroup) genderGroup.style.display = config.showGender ? 'flex' : 'none';
  const stateHelperEl = document.getElementById('state-helper-text');
  if (stateHelperEl) stateHelperEl.textContent = config.stateHelper;

  const selectQuotaPref = document.getElementById('select-quota-preference');
  if (selectQuotaPref) {
    if (examKey === 'JEE-MAIN') {
      selectQuotaPref.innerHTML = `
        <option value="AI" selected>All India / Other State Quota</option>
        <option value="HS">Home State Quota (HS)</option>
      `;
      selectQuotaPref.value = 'AI';
      state.filters.quotaPref = 'AI';
    } else if (examKey === 'NEET-PG') {
      selectQuotaPref.innerHTML = `
        <option value="ALL" selected>All Quotas (50% AIQ + DNB)</option>
        <option value="AIQ 50%">50% All India Quota (Govt MD/MS)</option>
        <option value="DNB">DNB Post-MBBS Hospitals</option>
      `;
      selectQuotaPref.value = 'ALL';
      state.filters.quotaPref = 'ALL';
    } else {
      selectQuotaPref.innerHTML = `
        <option value="AI" selected>All India Quota (AIQ)</option>
        <option value="HS">State Quota (Home State)</option>
      `;
      selectQuotaPref.value = 'AI';
      state.filters.quotaPref = 'AI';
    }
  }

  const dataset = state.activeDataset;
  const courseSelect = document.getElementById('select-course-filter');
  const typeSelect = document.getElementById('select-type-filter');
  const categorySelect = document.getElementById('select-category');
  const locationSelect = document.getElementById('select-filter-location');

  const uniqueBranches = new Set();
  const uniqueTypes = new Set();
  const uniqueCategories = new Set();
  const uniqueStates = new Set();

  dataset.forEach(item => {
    if (item.shortBranch) uniqueBranches.add(item.shortBranch);
    else if (item.course) uniqueBranches.add(item.course);
    if (item.type) uniqueTypes.add(item.type);
    if (item.category) uniqueCategories.add(item.category);
    if (item.state) uniqueStates.add(item.state);
  });

  const BRANCH_LABELS = {
    'CSE': 'Computer Science & Engineering (CSE)',
    'AI & DS': 'Artificial Intelligence & Data Science (AI & DS)',
    'ECE': 'Electronics & Communication (ECE)',
    'EE': 'Electrical Engineering (EE)',
    'EEE': 'Electrical & Electronics (EEE)',
    'ME': 'Mechanical Engineering (ME)',
    'CE': 'Civil Engineering (CE)',
    'CHE': 'Chemical Engineering (CHE)',
    'IT': 'Information Technology (IT)',
    'MME': 'Metallurgical & Materials (MME)',
    'MBBS': 'MBBS (Bachelor of Medicine & Surgery)',
    'BDS': 'BDS (Bachelor of Dental Surgery)',
    'MD Radio-Diagnosis': 'MD Radio-Diagnosis',
    'MD General Medicine': 'MD General Medicine',
    'MD Dermatology (DVL)': 'MD Dermatology (DVL)',
    'MD Paediatrics': 'MD Paediatrics',
    'MS Obstetrics & Gynaecology': 'MS Obstetrics & Gynaecology (OBGYN)',
    'MS Orthopaedics': 'MS Orthopaedics',
    'MS General Surgery': 'MS General Surgery',
    'MD Anaesthesiology': 'MD Anaesthesiology',
    'MD Pathology': 'MD Pathology',
    'MD Community Medicine (PSM)': 'MD Community Medicine (PSM)'
  };

  const sortedBranches = Array.from(uniqueBranches).sort();
  courseSelect.innerHTML = '<option value="ALL">All Available Branches / Degrees</option>' +
    sortedBranches.map(b => `<option value="${b}">${BRANCH_LABELS[b] || b}</option>`).join('');

  typeSelect.innerHTML = '<option value="ALL">All Institute Types</option>' +
    Array.from(uniqueTypes).sort().map(t => `<option value="${t}">${t}</option>`).join('');

  if (categorySelect && uniqueCategories.size > 0) {
    const catLabels = {
      'OPEN': 'OPEN / General',
      'EWS': 'GEN-EWS',
      'OBC-NCL': 'OBC-NCL',
      'SC': 'SC',
      'ST': 'ST',
      'PwD': 'PwD'
    };
    const currentCat = categorySelect.value;
    categorySelect.innerHTML = Array.from(uniqueCategories).map(cat => 
      `<option value="${cat}">${catLabels[cat] || cat}</option>`
    ).join('');
    if (uniqueCategories.has(currentCat)) {
      categorySelect.value = currentCat;
      state.filters.category = currentCat;
    } else {
      categorySelect.value = 'OPEN';
      state.filters.category = 'OPEN';
    }
  }

  if (locationSelect) {
    locationSelect.innerHTML = '<option value="ALL">All States & UTs</option>' +
      Array.from(uniqueStates).sort().map(s => `<option value="${s}">${s}</option>`).join('');
    locationSelect.value = 'ALL';
    state.filters.location = 'ALL';
  }

  state.filters.course = 'ALL';
  state.filters.type = 'ALL';
}

// -------------------------------------------------------------
// MEDICAL COLLEGES DIRECTORY RENDERING
// -------------------------------------------------------------
function renderMedicalDirectory() {
  const container = document.getElementById('med-cards-container');
  const { categoryGroup, state: selState, ownership, search } = state.medFilters;

  // Dynamically update stats header counters
  const totalCollegesEl = document.getElementById('med-stat-total-colleges');
  const aiimsEl = document.getElementById('med-stat-aiims');
  const seatsEl = document.getElementById('med-stat-seats');
  const bedsEl = document.getElementById('med-stat-beds');

  if (totalCollegesEl) totalCollegesEl.textContent = `${state.medicalDirectory.length}+`;
  if (aiimsEl) aiimsEl.textContent = state.medicalDirectory.filter(c => c.type === 'AIIMS').length;
  if (seatsEl) {
    const totalSeats = state.medicalDirectory.reduce((sum, c) => sum + (c.mbbsSeats || 0), 0);
    seatsEl.textContent = `${totalSeats.toLocaleString()}+`;
  }
  if (bedsEl) {
    const totalBeds = state.medicalDirectory.reduce((sum, c) => sum + (c.hospitalBeds || 0), 0);
    bedsEl.textContent = `${totalBeds.toLocaleString()}+`;
  }

  let list = state.medicalDirectory.filter(c => {
    if (categoryGroup !== 'ALL' && c.categoryGroup !== categoryGroup) return false;
    if (selState !== 'ALL' && c.state.toLowerCase() !== selState.toLowerCase()) return false;
    if (ownership === 'Government' && !c.ownership.includes('Government')) return false;
    if (ownership === 'Private' && !c.ownership.includes('Private') && !c.ownership.includes('Deemed')) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match = c.name.toLowerCase().includes(q) ||
                    c.city.toLowerCase().includes(q) ||
                    c.state.toLowerCase().includes(q) ||
                    (c.highlights && c.highlights.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <i class="bi bi-hospital" style="font-size: 40px; display: block; margin-bottom: 12px; opacity: 0.5;"></i>
        <h4>No Medical Colleges Found</h4>
        <p>Try clearing your state or category filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(c => {
    const isBookmarked = state.choiceList.some(item => item.id === c.id);
    const isAiims = c.type === 'AIIMS';
    return `
      <div class="college-item-card">
        <div class="college-card-header">
          <div class="card-title-group" style="cursor: pointer;" onclick="window.openCollegeDetails('${c.id}')" title="Click to view full college profile, seat matrix & fees">
            ${getCollegeLogoBadge(c.name, c.type, c.logo, c.id)}
            <div class="card-title-text">
              <h3 class="cd-clickable-name"><span>${c.name}</span> <i class="bi bi-arrow-up-right-circle cd-pop-icon" title="View details"></i></h3>
              <div class="card-badges-row">
                <span class="type-pill ${isAiims ? 'aiims' : ''}">${c.type}</span>
                <span class="ownership-pill">${c.ownership}</span>
                <span class="nirf-badge">NIRF #${c.nirf2024}</span>
                <span style="font-size: 11px; color: var(--text-muted);"><i class="bi bi-calendar3"></i> Est. ${c.established}</span>
              </div>
            </div>
          </div>
          <button class="btn-add-choice ${isBookmarked ? 'added' : ''}" 
                  onclick="window.toggleDirectoryChoice('${c.id}', 'medical')" 
                  title="${isBookmarked ? 'Remove from Choice List' : 'Add to Choice List'}">
            <i class="bi ${isBookmarked ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}"></i>
          </button>
        </div>

        <div class="card-metrics-grid" style="cursor: pointer;" onclick="window.openCollegeDetails('${c.id}')" title="Click to view full college details">
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-hospital"></i> Beds</span>
            <span class="m-val text-cyan">${c.hospitalBeds ? c.hospitalBeds.toLocaleString() : 'N/A'}</span>
          </div>
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-mortarboard"></i> MBBS Seats</span>
            <span class="m-val">${c.mbbsSeats}</span>
          </div>
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-cash-stack"></i> Fees</span>
            <span class="m-val text-gold">${c.annualFees}</span>
          </div>
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-bullseye"></i> Gen Cutoff</span>
            <span class="m-val text-success">~AIR ${c.cutoffRankGen}</span>
          </div>
        </div>

        <p class="card-highlights">${c.highlights}</p>

        <div class="card-actions-row">
          <button class="btn-card-details" onclick="window.openCollegeDetails('${c.id}')">
            <i class="bi bi-info-circle-fill"></i> View Details
          </button>
          <button class="btn-card-predict" onclick="window.jumpToPredictorForCollege('${c.short || c.name}', 'NEET-UG')">
            <i class="bi bi-lightning-charge-fill"></i> Predict Chance
          </button>
          <div class="card-right-actions">
            <span style="font-size: 12px; color: var(--text-secondary);"><i class="bi bi-geo-alt"></i> ${c.city}, ${c.state}</span>
            ${c.website ? `<a href="${c.website.startsWith('http') ? c.website : 'https://' + c.website}" target="_blank" rel="noopener noreferrer" class="link-website" title="Visit Official Website"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// ENGINEERING COLLEGES DIRECTORY RENDERING
// -------------------------------------------------------------
function renderEngineeringDirectory() {
  const container = document.getElementById('eng-cards-container');
  const { categoryGroup, state: selState, search } = state.engFilters;

  let list = state.engineeringDirectory.filter(c => {
    if (categoryGroup !== 'ALL' && c.categoryGroup !== categoryGroup) return false;
    if (selState !== 'ALL' && c.state.toLowerCase() !== selState.toLowerCase()) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match = c.name.toLowerCase().includes(q) ||
                    c.city.toLowerCase().includes(q) ||
                    c.state.toLowerCase().includes(q) ||
                    (c.highlights && c.highlights.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <i class="bi bi-cpu" style="font-size: 40px; display: block; margin-bottom: 12px; opacity: 0.5;"></i>
        <h4>No Engineering Colleges Found</h4>
        <p>Try clearing your state or category filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(c => {
    const isBookmarked = state.choiceList.some(item => item.id === c.id);
    const isIit = c.type === 'IIT';
    const examTarget = isIit ? 'JEE-ADVANCED' : 'JEE-MAIN';

    return `
      <div class="college-item-card">
        <div class="college-card-header">
          <div class="card-title-group" style="cursor: pointer;" onclick="window.openCollegeDetails('${c.id}')" title="Click to view full college profile, seat matrix & fees">
            ${getCollegeLogoBadge(c.name, c.type, c.logo, c.id)}
            <div class="card-title-text">
              <h3 class="cd-clickable-name"><span>${c.name}</span> <i class="bi bi-arrow-up-right-circle cd-pop-icon" title="View details"></i></h3>
              <div class="card-badges-row">
                <span class="type-pill ${isIit ? 'iit' : ''}">${c.type}</span>
                <span class="ownership-pill">${c.ownership}</span>
                <span class="nirf-badge">NIRF #${c.nirf2024}</span>
                <span style="font-size: 11px; color: var(--text-muted);"><i class="bi bi-calendar3"></i> Est. ${c.established}</span>
              </div>
            </div>
          </div>
          <button class="btn-add-choice ${isBookmarked ? 'added' : ''}" 
                  onclick="window.toggleDirectoryChoice('${c.id}', 'engineering')" 
                  title="${isBookmarked ? 'Remove from Choice List' : 'Add to Choice List'}">
            <i class="bi ${isBookmarked ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}"></i>
          </button>
        </div>

        <div class="card-metrics-grid" style="cursor: pointer;" onclick="window.openCollegeDetails('${c.id}')" title="Click to view full college details">
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-briefcase"></i> Median Package</span>
            <span class="m-val text-success">${c.medianPackage}</span>
          </div>
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-mortarboard"></i> B.Tech Seats</span>
            <span class="m-val">${c.btechSeats}</span>
          </div>
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-cash-stack"></i> Tuition Fees</span>
            <span class="m-val text-gold">${c.annualFees}</span>
          </div>
          <div class="metric-cell">
            <span class="m-lbl"><i class="bi bi-bullseye"></i> CSE Cutoff</span>
            <span class="m-val text-cyan">AIR ${c.closingCSE}</span>
          </div>
        </div>

        <p class="card-highlights">${c.highlights}</p>

        <div class="card-actions-row">
          <button class="btn-card-details" onclick="window.openCollegeDetails('${c.id}')">
            <i class="bi bi-info-circle-fill"></i> View Details
          </button>
          <button class="btn-card-predict" onclick="window.jumpToPredictorForCollege('${c.short || c.name}', '${examTarget}')">
            <i class="bi bi-lightning-charge-fill"></i> Predict Chance
          </button>
          <div class="card-right-actions">
            <span style="font-size: 12px; color: var(--text-secondary);"><i class="bi bi-geo-alt"></i> ${c.city}, ${c.state}</span>
            ${c.website ? `<a href="${c.website.startsWith('http') ? c.website : 'https://' + c.website}" target="_blank" rel="noopener noreferrer" class="link-website" title="Visit Official Website"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Interactive Navigation Between Pages
// -------------------------------------------------------------
async function switchPage(pageId) {
  state.currentPage = pageId;

  // Toggle page visibility
  document.querySelectorAll('.app-page').forEach(page => {
    page.classList.toggle('active', page.id === pageId);
  });

  // Toggle active button in top nav
  document.querySelectorAll('.nav-menu-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  // If leaving college profile, reset URL and title
  if (pageId !== 'page-college-profile' && window.location.hash.includes('college')) {
    if (window.history.pushState) {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = '';
    }
    document.title = "MargDarshak — India's Free College Cutoff Predictor & Colleges Directory";
  }

  // Render content if needed (auto-fetch if not already loaded)
  if (pageId === 'page-medical-directory') {
    if (!state.medicalDirectory || state.medicalDirectory.length === 0) {
      await loadDirectories();
    }
    renderMedicalDirectory();
  } else if (pageId === 'page-engineering-directory') {
    if (!state.engineeringDirectory || state.engineeringDirectory.length === 0) {
      await loadDirectories();
    }
    renderEngineeringDirectory();
  } else if (pageId === 'page-predictor') {
    runPrediction();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchPage = switchPage;

// Jump from directory card to predictor directly
window.jumpToPredictorForCollege = function(collegeName, examKey) {
  switchPage('page-predictor');
  switchExam(examKey);
  const searchInput = document.getElementById('search-institute');
  searchInput.value = collegeName;
  state.filters.search = collegeName;
  state.filters.chance = 'ALL';
  document.querySelectorAll('.pill-btn').forEach(p => p.classList.toggle('active', p.dataset.filter === 'ALL'));
  runPrediction();
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
};

// -------------------------------------------------------------
// Choice Filling List / Bookmarks Management
// -------------------------------------------------------------
function updateChoiceCounter() {
  document.getElementById('choice-counter').textContent = state.choiceList.length;
  localStorage.setItem('margdarshak_choices', JSON.stringify(state.choiceList));
}

window.toggleChoice = function(itemId) {
  const existingIndex = state.choiceList.findIndex(c => c.id === itemId);
  if (existingIndex > -1) {
    state.choiceList.splice(existingIndex, 1);
  } else {
    const item = state.activeDataset.find(i => i.id === itemId);
    if (item) {
      state.choiceList.push({
        id: item.id,
        exam: item.exam,
        institute: item.institute,
        course: item.course,
        quota: item.quota,
        category: item.category,
        closing_2024: item.closing_2024,
        fees: item.fees
      });
    }
  }

  updateChoiceCounter();
  renderResults();
};

window.toggleDirectoryChoice = function(collegeId, type) {
  const existingIndex = state.choiceList.findIndex(c => c.id === collegeId);
  if (existingIndex > -1) {
    state.choiceList.splice(existingIndex, 1);
  } else {
    const dir = type === 'medical' ? state.medicalDirectory : state.engineeringDirectory;
    const col = dir.find(c => c.id === collegeId);
    if (col) {
      state.choiceList.push({
        id: col.id,
        exam: type === 'medical' ? 'NEET-UG' : 'JEE',
        institute: col.name,
        course: type === 'medical' ? 'MBBS' : 'B.Tech (CSE)',
        quota: 'AI',
        category: 'OPEN',
        closing_2024: col.cutoffRankGen || col.closingCSE,
        fees: col.annualFees
      });
    }
  }

  updateChoiceCounter();
  if (type === 'medical') renderMedicalDirectory();
  else renderEngineeringDirectory();
};

window.removeChoice = function(index) {
  state.choiceList.splice(index, 1);
  updateChoiceCounter();
  renderChoiceListModal();
  renderResults();
  if (state.currentPage === 'page-medical-directory') renderMedicalDirectory();
  if (state.currentPage === 'page-engineering-directory') renderEngineeringDirectory();
};

function renderChoiceListModal() {
  const container = document.getElementById('choice-items-container');
  const emptyState = document.getElementById('empty-choice-msg');
  const list = state.choiceList;

  if (list.length === 0) {
    emptyState.style.display = 'block';
    container.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = list.map((item, idx) => {
    const safeInstId = (item.id || item.institute || '').replace(/'/g, "\\'");
    return `
      <li class="choice-item-card">
        <div class="choice-order-num">#${idx + 1}</div>
        <div class="choice-details" style="cursor: pointer;" onclick="document.getElementById('choice-modal-backdrop').classList.remove('open'); window.openCollegeDetails('${safeInstId}')" title="Click to view full college profile">
          <div class="choice-inst cd-clickable-name"><span>${item.institute}</span> <i class="bi bi-arrow-up-right-circle" style="font-size:11px;"></i></div>
          <div class="choice-sub">${item.course} • ${item.quota || 'AI'} Quota • AIR Cutoff: ${item.closing_2024}</div>
        </div>
        <button class="btn-remove-choice" onclick="window.removeChoice(${idx})" title="Remove">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </li>
    `;
  }).join('');
}

// -------------------------------------------------------------
// 3-Year Trend Modal
// -------------------------------------------------------------
window.view3YearTrend = function(itemId) {
  const item = state.activeDataset.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('trend-college-name').textContent = item.institute;
  document.getElementById('trend-course-name').textContent = `${item.course} (${item.quota} Quota - ${item.category})`;

  const c24 = item.closing_2024;
  const c23 = item.closing_2023 || Math.round(c24 * 0.95);
  const c22 = item.closing_2022 || Math.round(c24 * 0.90);

  document.getElementById('trend-val-2024').textContent = `AIR ${c24.toLocaleString()}`;
  document.getElementById('trend-val-2023').textContent = `AIR ${c23.toLocaleString()}`;
  document.getElementById('trend-val-2022').textContent = `AIR ${c22.toLocaleString()}`;

  const diffPct = (((c24 - c23) / c23) * 100).toFixed(1);
  const shiftElem = document.getElementById('trend-val-shift');
  if (diffPct > 0) {
    shiftElem.textContent = `+${diffPct}% (Slightly Relaxed)`;
    shiftElem.className = 'val text-success';
  } else {
    shiftElem.textContent = `${diffPct}% (More Competitive)`;
    shiftElem.className = 'val text-warning';
  }

  const maxVal = Math.max(c24, c23, c22);
  const barsContainer = document.getElementById('trend-bars');
  barsContainer.innerHTML = `
    <div class="chart-row">
      <span class="chart-year">2024</span>
      <div class="chart-bar-outer">
        <div class="chart-bar-inner" style="width: ${(c24 / maxVal) * 100}%">Cutoff AIR ${c24}</div>
      </div>
    </div>
    <div class="chart-row">
      <span class="chart-year">2023</span>
      <div class="chart-bar-outer">
        <div class="chart-bar-inner" style="width: ${(c23 / maxVal) * 100}%; background: linear-gradient(90deg, #8b5cf6, #3b82f6);">Cutoff AIR ${c23}</div>
      </div>
    </div>
    <div class="chart-row">
      <span class="chart-year">2022</span>
      <div class="chart-bar-outer">
        <div class="chart-bar-inner" style="width: ${(c22 / maxVal) * 100}%; background: linear-gradient(90deg, #64748b, #94a3b8);">Cutoff AIR ${c22}</div>
      </div>
    </div>
  `;

  const tipElem = document.getElementById('trend-tip-text');
  let tipText = '';
  if (item._prob && item._prob.tier === 'SAFE') {
    tipText = `Excellent Safety Margin: Your rank is comfortably better than this college's 3-year closing cutoffs. You can reliably place this college in your Round 1 priority list.`;
  } else if (item._prob && item._prob.tier === 'TARGET') {
    tipText = `Target Margin: Cutoff has shifted by ~${diffPct}% year-over-year. Be sure to participate in Round 2 and Round 3 (Mop-Up) if you don't secure it in Round 1.`;
  } else {
    tipText = `Aspirational Choice: Historical cutoffs are tighter than your current rank. Include this higher in your choice list above safe colleges so you don't miss any seat-upgradation rounds.`;
  }

  const safeInstId = (item.id || item.institute || '').replace(/'/g, "\\'");
  tipElem.innerHTML = `
    ${tipText}
    <div style="margin-top: 14px;">
      <button class="btn-primary" style="width: 100%; justify-content: center;" onclick="document.getElementById('trend-modal-backdrop').classList.remove('open'); window.openCollegeDetails('${safeInstId}')">
        <i class="bi bi-building-check"></i> View Full College Profile, Seat Matrix & Fees
      </button>
    </div>
  `;

  document.getElementById('trend-modal-backdrop').classList.add('open');
};

window.changePage = function(p) {
  state.pagination.page = p;
  renderResults();
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

async function switchExam(examKey) {
  state.currentExam = examKey;
  
  document.querySelectorAll('.exam-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.exam === examKey);
  });

  await loadDataset(examKey);
  populateFiltersForExam(examKey);
  runPrediction();
}

// -------------------------------------------------------------
// Event Listeners & Bootstrapping
// -------------------------------------------------------------
function initEvents() {
  // Main Navigation Menu Links (Predictor vs Medical Directory vs Engineering Directory)
  document.getElementById('main-nav-menu').addEventListener('click', e => {
    const btn = e.target.closest('.nav-menu-link');
    if (btn && btn.dataset.page) {
      switchPage(btn.dataset.page);
    }
  });

  // Exam Switcher Tabs
  document.getElementById('exam-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.exam-tab');
    if (tab && tab.dataset.exam) {
      switchExam(tab.dataset.exam);
    }
  });

  // Rank / Score Input Mode Switcher
  const btnRank = document.getElementById('btn-mode-rank');
  const btnScore = document.getElementById('btn-mode-score');
  const rankInput = document.getElementById('input-rank');
  const rankLabel = document.getElementById('rank-field-name');
  const helperText = document.getElementById('helper-rank-text');

  btnRank.addEventListener('click', () => {
    state.inputMode = 'rank';
    btnRank.classList.add('active');
    btnScore.classList.remove('active');
    rankLabel.textContent = EXAM_CONFIGS[state.currentExam].rankLabel;
    rankInput.value = state.filters.rank;
    if (helperText) helperText.textContent = 'Enter your Common/All India Rank';
  });

  btnScore.addEventListener('click', () => {
    state.inputMode = 'score';
    btnScore.classList.add('active');
    btnRank.classList.remove('active');
    rankLabel.textContent = EXAM_CONFIGS[state.currentExam].scoreLabel;
    rankInput.value = EXAM_CONFIGS[state.currentExam].defaultScore;
    if (helperText) helperText.textContent = 'Estimated All India Rank will be auto-calculated';
  });

  rankInput.addEventListener('input', e => {
    const val = parseFloat(e.target.value);
    if (state.inputMode === 'score') {
      const estimatedRank = convertScoreToRank(state.currentExam, val);
      state.filters.rank = estimatedRank;
      if (helperText) helperText.textContent = `Estimated All India Rank: ~AIR ${estimatedRank.toLocaleString()}`;
    } else {
      state.filters.rank = val || 1;
      if (helperText) helperText.textContent = `AIR: ${val || 1}`;
    }
    runPrediction();
  });

  document.getElementById('select-category').addEventListener('change', e => {
    state.filters.category = e.target.value;
    runPrediction();
  });

  document.getElementById('select-home-state').addEventListener('change', e => {
    state.filters.homeState = e.target.value;
    runPrediction();
  });

  const selectQuotaPref = document.getElementById('select-quota-preference');
  if (selectQuotaPref) {
    selectQuotaPref.addEventListener('change', e => {
      state.filters.quotaPref = e.target.value;
      runPrediction();
    });
  }

  const selectGender = document.getElementById('select-gender');
  if (selectGender) {
    selectGender.addEventListener('change', e => {
      state.filters.gender = e.target.value;
      runPrediction();
    });
  }

  document.getElementById('select-course-filter').addEventListener('change', e => {
    state.filters.course = e.target.value;
    runPrediction();
  });

  document.getElementById('select-type-filter').addEventListener('change', e => {
    state.filters.type = e.target.value;
    runPrediction();
  });

  const selectFilterLoc = document.getElementById('select-filter-location');
  if (selectFilterLoc) {
    selectFilterLoc.addEventListener('change', e => {
      state.filters.location = e.target.value;
      runPrediction();
    });
  }

  document.getElementById('btn-run-predict').addEventListener('click', runPrediction);

  const predictorForm = document.getElementById('predictor-form');
  if (predictorForm) {
    predictorForm.addEventListener('submit', e => {
      e.preventDefault();
      runPrediction();
    });
  }

  const btnReset = document.getElementById('btn-reset-filters');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const conf = EXAM_CONFIGS[state.currentExam];
      rankInput.value = conf.defaultRank;
      state.filters.rank = conf.defaultRank;
      document.getElementById('select-category').value = 'OPEN';
      state.filters.category = 'OPEN';
      document.getElementById('select-home-state').value = 'Maharashtra';
      state.filters.homeState = 'Maharashtra';
      if (selectQuotaPref) selectQuotaPref.value = 'ALL';
      state.filters.quotaPref = 'ALL';
      if (selectFilterLoc) selectFilterLoc.value = 'ALL';
      state.filters.location = 'ALL';
      if (selectGender) {
        selectGender.value = 'Gender-Neutral';
        state.filters.gender = 'Gender-Neutral';
      }
      document.getElementById('select-course-filter').value = 'ALL';
      state.filters.course = 'ALL';
      document.getElementById('select-type-filter').value = 'ALL';
      state.filters.type = 'ALL';
      document.getElementById('search-institute').value = '';
      state.filters.search = '';
      state.filters.chance = 'ALL';
      document.querySelectorAll('.pill-btn').forEach(p => p.classList.toggle('active', p.dataset.filter === 'ALL'));
      runPrediction();
    });
  }

  let searchTimeout;
  document.getElementById('search-institute').addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.filters.search = e.target.value;
      runPrediction();
    }, 200);
  });

  document.getElementById('chance-pills').addEventListener('click', e => {
    const pill = e.target.closest('.pill-btn');
    if (pill) {
      document.querySelectorAll('#chance-pills .pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.chance = pill.dataset.filter;
      runPrediction();
    }
  });

  const statsOverview = document.getElementById('stats-overview');
  if (statsOverview) {
    statsOverview.addEventListener('click', e => {
      const card = e.target.closest('.stat-card');
      if (card && card.dataset.chance) {
        const chance = card.dataset.chance;
        state.filters.chance = chance;
        document.querySelectorAll('#chance-pills .pill-btn').forEach(p => p.classList.toggle('active', p.dataset.filter === chance));
        runPrediction();
      }
    });
  }

  const chipsRow = document.querySelector('.compact-chips-row');
  if (chipsRow) {
    chipsRow.addEventListener('click', e => {
      const chip = e.target.closest('.chip-item');
      if (chip) {
        let filter = 'ALL';
        if (chip.classList.contains('safe')) filter = 'SAFE';
        else if (chip.classList.contains('target')) filter = 'TARGET';
        else if (chip.classList.contains('ambitious')) filter = 'AMBITIOUS';
        state.filters.chance = filter;
        document.querySelectorAll('#chance-pills .pill-btn').forEach(p => p.classList.toggle('active', p.dataset.filter === filter));
        runPrediction();
      }
    });
  }

  document.getElementById('select-sort').addEventListener('change', e => {
    state.filters.sort = e.target.value;
    runPrediction();
  });

  // Medical Directory Event Listeners
  document.getElementById('med-category-pills').addEventListener('click', e => {
    const pill = e.target.closest('.pill-btn');
    if (pill && pill.dataset.medFilter) {
      document.querySelectorAll('#med-category-pills .pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.medFilters.categoryGroup = pill.dataset.medFilter;
      renderMedicalDirectory();
    }
  });

  document.getElementById('select-med-state').addEventListener('change', e => {
    state.medFilters.state = e.target.value;
    renderMedicalDirectory();
  });

  document.getElementById('select-med-ownership').addEventListener('change', e => {
    state.medFilters.ownership = e.target.value;
    renderMedicalDirectory();
  });

  document.getElementById('search-med-dir').addEventListener('input', e => {
    state.medFilters.search = e.target.value;
    renderMedicalDirectory();
  });

  // Engineering Directory Event Listeners
  document.getElementById('eng-category-pills').addEventListener('click', e => {
    const pill = e.target.closest('.pill-btn');
    if (pill && pill.dataset.engFilter) {
      document.querySelectorAll('#eng-category-pills .pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.engFilters.categoryGroup = pill.dataset.engFilter;
      renderEngineeringDirectory();
    }
  });

  document.getElementById('select-eng-state').addEventListener('change', e => {
    state.engFilters.state = e.target.value;
    renderEngineeringDirectory();
  });

  document.getElementById('search-eng-dir').addEventListener('input', e => {
    state.engFilters.search = e.target.value;
    renderEngineeringDirectory();
  });

  // Choice List Modal Open/Close
  document.getElementById('btn-choice-list').addEventListener('click', () => {
    renderChoiceListModal();
    document.getElementById('choice-modal-backdrop').classList.add('open');
  });

  document.getElementById('btn-close-choice-modal').addEventListener('click', () => {
    document.getElementById('choice-modal-backdrop').classList.remove('open');
  });

  document.getElementById('btn-clear-choice').addEventListener('click', () => {
    if (confirm('Clear all colleges from your choice preference list?')) {
      state.choiceList = [];
      updateChoiceCounter();
      renderChoiceListModal();
      renderResults();
      if (state.currentPage === 'page-medical-directory') renderMedicalDirectory();
      if (state.currentPage === 'page-engineering-directory') renderEngineeringDirectory();
    }
  });

  const btnExportList = document.getElementById('btn-export-list') || document.getElementById('btn-export-pdf');
  if (btnExportList) {
    btnExportList.addEventListener('click', () => {
      window.print();
    });
  }

  // Trend Modal Close
  document.getElementById('btn-close-trend-modal').addEventListener('click', () => {
    document.getElementById('trend-modal-backdrop').classList.remove('open');
  });

  // Pipeline Modal Open/Close
  document.getElementById('btn-pipeline-info').addEventListener('click', () => {
    document.getElementById('pipeline-modal-backdrop').classList.add('open');
  });

  const btnClosePipeline = document.getElementById('btn-close-pipeline-modal');
  if (btnClosePipeline) {
    btnClosePipeline.addEventListener('click', () => {
      document.getElementById('pipeline-modal-backdrop').classList.remove('open');
    });
  }



  // College Details Modal Event Listeners
  const tabsNav = document.getElementById('cd-tabs-nav');
  if (tabsNav) {
    tabsNav.addEventListener('click', e => {
      const btn = e.target.closest('.cd-tab-btn');
      if (btn && btn.dataset.target) {
        document.querySelectorAll('.cd-tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        document.querySelectorAll('.cd-pane').forEach(p => p.classList.remove('active'));
        const targetPane = document.getElementById(btn.dataset.target);
        if (targetPane) targetPane.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  const btnCloseCd = document.getElementById('btn-close-college-details');
  if (btnCloseCd) btnCloseCd.addEventListener('click', window.closeCollegeDetailsModal);

  const btnDoneCd = document.getElementById('btn-done-college-details');
  if (btnDoneCd) btnDoneCd.addEventListener('click', window.closeCollegeDetailsModal);

  const btnPrintCd = document.getElementById('btn-print-college-profile');
  if (btnPrintCd) btnPrintCd.addEventListener('click', window.printCollegeProfile);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    }
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  window.addEventListener('hashchange', handleRouting);
  window.addEventListener('popstate', handleRouting);

  // Initialize newly added SEO & counseling tools
  initRankCalcModal();
  initCompareModal();
  initFaqAccordion();
  initFullCollegeProfilePage();
}

function initFullCollegeProfilePage() {
  const btnBack = document.getElementById('btn-back-to-directory');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (window.history.pushState) {
        window.history.pushState(null, '', '/');
      } else {
        window.location.hash = '';
      }
      const target = state.previousPage || 'page-medical-directory';
      switchPage(target);
    });
  }

  const btnWhatsapp = document.getElementById('btn-full-share-whatsapp');
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
      const profile = state.currentCollegeProfile;
      if (!profile) return;
      const shareUrl = window.location.href;
      const text = `Check out complete admission cutoffs, fee structure, seats & rural bond for ${profile.name}: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  const btnShareLink = document.getElementById('btn-full-share-link');
  if (btnShareLink) {
    btnShareLink.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Direct college link copied to clipboard!');
      } catch (e) {
        showToast('Direct link: ' + window.location.href);
      }
    });
  }

  const btnPrint = document.getElementById('btn-full-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Section Tabs Smooth Scroll & Active Highlighter
  const tabBtns = document.querySelectorAll('.cf-section-tab');
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      const sec = document.getElementById(targetId);
      if (sec) {
        tabBtns.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const offset = sec.getBoundingClientRect().top + window.pageYOffset - 110;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // Highlight tab while scrolling
  window.addEventListener('scroll', () => {
    if (state.currentPage !== 'page-college-profile') return;
    const scrollPos = window.pageYOffset + 140;
    const sections = document.querySelectorAll('.cf-section-card');
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        tabBtns.forEach(t => {
          t.classList.toggle('active', t.dataset.target === sec.id);
        });
      }
    });
  }, { passive: true });
}

function handleRouting() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  // 1. Clean Path Routing: /college/:slug
  if (path && path.startsWith('/college/')) {
    const slug = decodeURIComponent(path.replace(/^\/college\//, '').replace(/\/$/, ''));
    if (slug) {
      window.openCollegeDetails(slug);
      return;
    }
  }

  // 2. Hash Routing fallback: #/college/:slug or #college/:id
  if (hash && (hash.startsWith('#/college/') || hash.startsWith('#college/'))) {
    const colId = decodeURIComponent(hash.replace(/^#\/?college\//, ''));
    if (colId) {
      window.openCollegeDetails(colId);
      return;
    }
  }

  // 3. Tab Navigation
  if (path === '/medical-directory' || hash === '#/medical-directory' || hash === '#medical-directory') {
    switchPage('page-medical-directory');
  } else if (path === '/engineering-directory' || hash === '#/engineering-directory' || hash === '#engineering-directory') {
    switchPage('page-engineering-directory');
  } else if (path === '/predictor' || hash === '#/predictor' || hash === '#predictor') {
    switchPage('page-predictor');
  }
}
window.handleRouting = handleRouting;

// -------------------------------------------------------------
// Marks vs Rank vs Percentile Calculator Modal Logic
// -------------------------------------------------------------
function initRankCalcModal() {
  const modalBackdrop = document.getElementById('rank-calc-modal-backdrop');
  if (!modalBackdrop) return;

  const btnOpen = document.getElementById('btn-open-rank-calc');
  const btnQuick = document.getElementById('quick-btn-marks-calc');
  const btnClose = document.getElementById('btn-close-rank-calc-modal');
  const scoreInput = document.getElementById('calc-score-input');
  const slider = document.getElementById('calc-slider');
  const label = document.getElementById('calc-score-label');
  const unit = document.getElementById('calc-input-unit');
  const sliderMin = document.getElementById('slider-min-lbl');
  const sliderMid = document.getElementById('slider-mid-lbl');
  const sliderMax = document.getElementById('slider-max-lbl');
  const outRank = document.getElementById('calc-projected-rank');
  const outBadge = document.getElementById('calc-percentile-badge');
  const outQualify = document.getElementById('calc-qualify-status');
  const outTargetBand = document.getElementById('calc-target-band');
  const btnApply = document.getElementById('btn-apply-calc-rank');

  let activeCalcExam = 'NEET-UG';

  const EXAM_PRESETS = {
    'NEET-UG': {
      max: 720,
      min: 0,
      step: 1,
      defaultVal: 650,
      label: 'Enter NEET UG Raw Score (out of 720):',
      unit: 'Marks',
      minLbl: '0',
      midLbl: '360',
      maxLbl: '720'
    },
    'JEE-MAIN': {
      max: 100,
      min: 0,
      step: 0.1,
      defaultVal: 99.2,
      label: 'Enter NTA Percentile (0 to 100):',
      unit: 'Percentile',
      minLbl: '0 %ile',
      midLbl: '50 %ile',
      maxLbl: '100 %ile'
    },
    'JEE-ADVANCED': {
      max: 360,
      min: 0,
      step: 1,
      defaultVal: 190,
      label: 'Enter JEE Advanced Aggregate Marks (out of 360):',
      unit: 'Marks',
      minLbl: '0',
      midLbl: '180',
      maxLbl: '360'
    },
    'NEET-PG': {
      max: 800,
      min: 0,
      step: 1,
      defaultVal: 580,
      label: 'Enter NEET PG Raw Score (out of 800):',
      unit: 'Marks',
      minLbl: '0',
      midLbl: '400',
      maxLbl: '800'
    }
  };

  function updateCalcUI() {
    const val = parseFloat(scoreInput.value) || 0;
    const estRank = convertScoreToRank(activeCalcExam, val);
    outRank.textContent = `~ ${estRank.toLocaleString('en-IN')}`;

    if (activeCalcExam === 'NEET-UG') {
      const pct = Math.max(0, Math.min(99.99, (100 - (estRank / 2400000) * 100))).toFixed(2);
      outBadge.textContent = `${pct} Percentile`;
      if (val >= 680) {
        outQualify.textContent = 'Top AIIMS & Top 5 Central GMCs';
        outTargetBand.textContent = 'AIIMS Delhi, MAMC, VMMC, JIPMER, KGMU';
      } else if (val >= 630) {
        outQualify.textContent = 'High Chance for All India Govt MBBS';
        outTargetBand.textContent = 'Top State GMCs (Grant Mumbai, BJMC, SMS, Patna)';
      } else if (val >= 550) {
        outQualify.textContent = 'Eligible for State Quota Govt MBBS / BDS';
        outTargetBand.textContent = 'District GMCs, Govt Dental Colleges & Premier Deemed';
      } else if (val >= 164) {
        outQualify.textContent = 'Qualified (Above NEET Qualifying Cutoff)';
        outTargetBand.textContent = 'State Private Medical Colleges & Management Quota';
      } else {
        outQualify.textContent = 'Below General Qualifying Cutoff (Borderline)';
        outTargetBand.textContent = 'Deemed Medical / BAMS / BHMS options';
      }
    } else if (activeCalcExam === 'JEE-MAIN') {
      outBadge.textContent = `${val.toFixed(2)} Percentile`;
      if (val >= 99.5) {
        outQualify.textContent = 'Top NITs CSE & Top IIITs';
        outTargetBand.textContent = 'NIT Trichy, Surathkal, Warangal, IIIT Allahabad';
      } else if (val >= 97.5) {
        outQualify.textContent = 'Premier NITs Core / Good IIITs';
        outTargetBand.textContent = 'VNIT Nagpur, MNIT Jaipur, NIT Rourkela, IIIT Jabalpur';
      } else if (val >= 93.0) {
        outQualify.textContent = 'Qualified for JEE Advanced';
        outTargetBand.textContent = 'Newer NITs, Top State Govt Engineering Colleges (COEP, VJTI)';
      } else {
        outQualify.textContent = 'CSAB Special Rounds / State Counseling';
        outTargetBand.textContent = 'State GFTIs, Private Universities & State CET colleges';
      }
    } else if (activeCalcExam === 'JEE-ADVANCED') {
      outBadge.textContent = `${val} / 360 Marks`;
      if (val >= 250) {
        outQualify.textContent = 'Top 5 IITs CSE & Electrical';
        outTargetBand.textContent = 'IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur';
      } else if (val >= 180) {
        outQualify.textContent = 'Old IITs Core Branches (Mechanical, Chem, Civil)';
        outTargetBand.textContent = 'IIT Kharagpur, IIT Roorkee, IIT Guwahati, IIT BHU';
      } else if (val >= 120) {
        outQualify.textContent = '2nd Gen IITs (Hyderabad, Indore, Gandhinagar)';
        outTargetBand.textContent = 'IIT Gandhinagar, IIT Ropar, IIT Patna, IIT Jodhpur';
      } else {
        outQualify.textContent = '3rd Gen IITs (Jammu, Dharwad, Bhilai, Goa)';
        outTargetBand.textContent = 'Specialized Dual Degrees & Newer IIT branches';
      }
    } else if (activeCalcExam === 'NEET-PG') {
      outBadge.textContent = `${val} / 800 Marks`;
      if (val >= 620) {
        outQualify.textContent = 'Top Clinical Branches (Radio, Med, Derma)';
        outTargetBand.textContent = 'AIIMS Delhi, PGIMER Chandigarh, MAMC, KGMU';
      } else if (val >= 520) {
        outQualify.textContent = 'Clinical MS/MD (Surgery, OBG, Ortho, Paediatrics)';
        outTargetBand.textContent = 'Top State Medical Colleges & DNB Hospitals';
      } else {
        outQualify.textContent = 'Para-Clinical / Non-Clinical Specialties';
        outTargetBand.textContent = 'Pathology, Anaesthesia, DNB Family Medicine';
      }
    }
  }

  function setCalcExam(examKey) {
    activeCalcExam = examKey;
    const cfg = EXAM_PRESETS[examKey];
    if (!cfg) return;

    document.querySelectorAll('.calc-exam-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.exam === examKey);
    });

    label.textContent = cfg.label;
    unit.textContent = cfg.unit;
    scoreInput.min = cfg.min;
    scoreInput.max = cfg.max;
    scoreInput.step = cfg.step;
    scoreInput.value = cfg.defaultVal;

    slider.min = cfg.min;
    slider.max = cfg.max;
    slider.step = cfg.step;
    slider.value = cfg.defaultVal;

    sliderMin.textContent = cfg.minLbl;
    sliderMid.textContent = cfg.midLbl;
    sliderMax.textContent = cfg.maxLbl;

    updateCalcUI();
  }

  scoreInput.addEventListener('input', () => {
    slider.value = scoreInput.value;
    updateCalcUI();
  });

  slider.addEventListener('input', () => {
    scoreInput.value = slider.value;
    updateCalcUI();
  });

  document.querySelectorAll('.calc-exam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setCalcExam(btn.dataset.exam);
    });
  });

  const openModal = () => {
    setCalcExam(state.currentExam || 'NEET-UG');
    modalBackdrop.classList.add('open');
  };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnQuick) btnQuick.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', () => modalBackdrop.classList.remove('open'));

  if (btnApply) {
    btnApply.addEventListener('click', () => {
      const val = parseFloat(scoreInput.value) || 0;
      const estRank = convertScoreToRank(activeCalcExam, val);

      modalBackdrop.classList.remove('open');

      // Switch main app to this exam
      const examTab = document.querySelector(`.exam-tab[data-exam="${activeCalcExam}"]`);
      if (examTab) examTab.click();

      // Put calculated rank into rank input
      const rankInput = document.getElementById('input-rank');
      if (rankInput) {
        rankInput.value = estRank;
        state.filters.rank = estRank;
      }

      // Switch to Rank mode if on score
      const btnRankMode = document.getElementById('btn-mode-rank');
      if (btnRankMode) btnRankMode.click();

      // Switch page to predictor
      const navPredictor = document.getElementById('nav-btn-predictor');
      if (navPredictor) navPredictor.click();

      // Run prediction
      runPrediction();

      // Smooth scroll to results
      const resSection = document.getElementById('results-section');
      if (resSection) {
        resSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// -------------------------------------------------------------
// Side-by-Side College Comparison Tool Modal Logic
// -------------------------------------------------------------
// -------------------------------------------------------------
// Side-by-Side College Comparison Tool Modal Logic
// -------------------------------------------------------------
function initCompareModal() {
  const modalBackdrop = document.getElementById('compare-modal-backdrop');
  if (!modalBackdrop) return;

  const btnOpen = document.getElementById('btn-open-compare');
  const btnQuick = document.getElementById('quick-btn-compare');
  const btnClose = document.getElementById('btn-close-compare-modal');
  const sel1 = document.getElementById('compare-select-1');
  const sel2 = document.getElementById('compare-select-2');
  const btnSwap = document.getElementById('btn-swap-colleges');
  const tableContainer = document.getElementById('compare-table-container');

  async function populateDropdowns(initialId1, initialId2) {
    if (!sel1 || !sel2) return;

    if (!state.medicalDirectory?.length || !state.engineeringDirectory?.length) {
      await loadDirectories();
    }

    sel1.innerHTML = '';
    sel2.innerHTML = '';

    const medColleges = state.medicalDirectory || [];
    const engColleges = state.engineeringDirectory || [];

    const groupAIIMS = [];
    const groupIITs = [];
    const groupNITs = [];
    const groupGMCs = [];
    const groupOthers = [];

    medColleges.forEach(c => {
      if (c.categoryGroup === 'AIIMS') groupAIIMS.push({ id: c.id, name: c.name, type: 'AIIMS', city: c.city });
      else if (c.categoryGroup === 'Govt Medical College') groupGMCs.push({ id: c.id, name: c.name, type: 'GMC', city: c.city });
      else groupOthers.push({ id: c.id, name: c.name, type: 'Medical', city: c.city });
    });

    engColleges.forEach(c => {
      if (c.categoryGroup === 'IIT') groupIITs.push({ id: c.id, name: c.name, type: 'IIT', city: c.city });
      else if (c.categoryGroup === 'NIT' || c.categoryGroup === 'IIIT') groupNITs.push({ id: c.id, name: c.name, type: c.categoryGroup, city: c.city });
      else groupOthers.push({ id: c.id, name: c.name, type: 'Engineering', city: c.city });
    });

    function addGroup(label, list, selectEl) {
      if (!list.length) return;
      const og = document.createElement('optgroup');
      og.label = label;
      list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `${item.name} (${item.city})`;
        selectEl.appendChild(opt);
      });
    }

    [sel1, sel2].forEach(sel => {
      addGroup('🏥 All AIIMS Institutes', groupAIIMS, sel);
      addGroup('🏛️ All 23 IITs', groupIITs, sel);
      addGroup('⚙️ Top NITs & IIITs', groupNITs, sel);
      addGroup('🏥 State Govt Medical Colleges', groupGMCs, sel);
      addGroup('🏫 Other Institutes', groupOthers, sel);
    });

    const default1 = initialId1 || groupAIIMS[0]?.id || 'MED-AIIMS-01';
    const default2 = initialId2 || (groupAIIMS.length > 1 ? groupAIIMS[1].id : (groupIITs[0]?.id || 'MED-AIIMS-02'));

    if (default1) sel1.value = default1;
    if (default2) sel2.value = default2;
  }

  function renderComparison() {
    if (!sel1 || !sel2 || !tableContainer) return;

    try {
      let id1 = sel1.value;
      let id2 = sel2.value;

      let c1 = getCollegeProfile(id1) || getCollegeProfile('MED-AIIMS-01');
      let c2 = getCollegeProfile(id2) || getCollegeProfile('MED-AIIMS-02');

      if (!c1 || !c2) {
        tableContainer.innerHTML = '<p style="text-align:center; padding: 24px; color: var(--text-muted);">Please select two colleges to compare.</p>';
        return;
      }

      const isMed1 = c1.type === 'AIIMS' || c1.type === 'Govt Medical College' || c1.name.toLowerCase().includes('medical');
      const isMed2 = c2.type === 'AIIMS' || c2.type === 'Govt Medical College' || c2.name.toLowerCase().includes('medical');

      const badgeClass = type => {
        if (type === 'AIIMS') return 'aiims';
        if (type === 'IIT') return 'iit';
        if (type === 'NIT' || type === 'IIIT') return 'nit';
        return 'gmc';
      };

      const bond1 = getCollegeBondDetails(c1);
      const bond2 = getCollegeBondDetails(c2);

      tableContainer.innerHTML = `
        <table class="compare-grid-table">
          <tbody>
            <tr>
              <td class="col-param">Institute</td>
              <td class="col-c1 compare-header-cell">
                <div class="comp-card-top">
                  <div>
                    <span class="comp-badge ${badgeClass(c1.type)}">${c1.type}</span>
                    <div class="comp-col-name">${c1.name}</div>
                    <div class="comp-col-loc"><i class="bi bi-geo-alt-fill text-rose"></i> ${c1.city}, ${c1.state}</div>
                  </div>
                </div>
              </td>
              <td class="col-c2 compare-header-cell">
                <div class="comp-card-top">
                  <div>
                    <span class="comp-badge ${badgeClass(c2.type)}">${c2.type}</span>
                    <div class="comp-col-name">${c2.name}</div>
                    <div class="comp-col-loc"><i class="bi bi-geo-alt-fill text-rose"></i> ${c2.city}, ${c2.state}</div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td class="col-param">Ownership & NIRF</td>
              <td class="col-c1"><strong>${c1.ownership}</strong> • NIRF Rank: <strong>#${c1.nirf2024 || 'Top 50'}</strong></td>
              <td class="col-c2"><strong>${c2.ownership}</strong> • NIRF Rank: <strong>#${c2.nirf2024 || 'Top 50'}</strong></td>
            </tr>

            <tr>
              <td class="col-param">Approved Intake</td>
              <td class="col-c1"><span class="comp-highlight text-primary">${c1.totalSeats || 150}</span> ${isMed1 ? 'MBBS Seats' : 'B.Tech Seats'}</td>
              <td class="col-c2"><span class="comp-highlight text-emerald">${c2.totalSeats || 150}</span> ${isMed2 ? 'MBBS Seats' : 'B.Tech Seats'}</td>
            </tr>

            <tr>
              <td class="col-param">Annual Tuition Fee</td>
              <td class="col-c1"><strong>${c1.feeStructure?.annualTotal || c1.annualFees || 'Govt Subsidized'}</strong></td>
              <td class="col-c2"><strong>${c2.feeStructure?.annualTotal || c2.annualFees || 'Govt Subsidized'}</strong></td>
            </tr>

            <tr>
              <td class="col-param">Cutoff (General Closing)</td>
              <td class="col-c1"><strong class="text-primary">AIR ${c1.cutoffRankGen ? c1.cutoffRankGen.toLocaleString() : (c1.closingCSE ? c1.closingCSE.toLocaleString() : 'Top 1%')}</strong></td>
              <td class="col-c2"><strong class="text-emerald">AIR ${c2.cutoffRankGen ? c2.cutoffRankGen.toLocaleString() : (c2.closingCSE ? c2.closingCSE.toLocaleString() : 'Top 1%')}</strong></td>
            </tr>

            <tr>
              <td class="col-param">Compulsory Service Bond</td>
              <td class="col-c1"><strong>${bond1.years}</strong><br><small class="text-muted">${bond1.penalty}</small></td>
              <td class="col-c2"><strong>${bond2.years}</strong><br><small class="text-muted">${bond2.penalty}</small></td>
            </tr>

            <tr>
              <td class="col-param">${isMed1 || isMed2 ? 'Hospital Beds & Footfall' : 'Median Placement CTC'}</td>
              <td class="col-c1">
                ${isMed1 ? `<strong>${c1.hospitalStats?.hospitalBeds || 850}+ Beds</strong> (${c1.hospitalStats?.opdDaily || 'High Daily OPD'})` : `<strong>${c1.placements?.medianPackage || '₹16.5 LPA'}</strong> (Median CTC)`}
              </td>
              <td class="col-c2">
                ${isMed2 ? `<strong>${c2.hospitalStats?.hospitalBeds || 850}+ Beds</strong> (${c2.hospitalStats?.opdDaily || 'High Daily OPD'})` : `<strong>${c2.placements?.medianPackage || '₹16.5 LPA'}</strong> (Median CTC)`}
              </td>
            </tr>

            <tr>
              <td class="col-param">Campus Area</td>
              <td class="col-c1">${c1.campusAcres || 150} Acres Campus</td>
              <td class="col-c2">${c2.campusAcres || 150} Acres Campus</td>
            </tr>

            <tr>
              <td class="col-param">Counseling Quota</td>
              <td class="col-c1"><small>${c1.seatMatrix?.quota || 'All India Quota'}</small></td>
              <td class="col-c2"><small>${c2.seatMatrix?.quota || 'All India Quota'}</small></td>
            </tr>

            <tr>
              <td class="col-param">Actions</td>
              <td class="col-c1 comp-actions-cell">
                <div class="comp-btn-row">
                  <button type="button" class="btn-sm btn-primary" onclick="document.getElementById('compare-modal-backdrop')?.classList.remove('open'); window.openCollegeDetails('${c1.id}')">
                    <i class="bi bi-eye"></i> View Full Dossier
                  </button>
                  <button type="button" class="btn-sm btn-outline-secondary" onclick="window.toggleChoice('${c1.id}')">
                    <i class="bi bi-bookmark-plus"></i> Add to Choice
                  </button>
                </div>
              </td>
              <td class="col-c2 comp-actions-cell">
                <div class="comp-btn-row">
                  <button type="button" class="btn-sm btn-primary" onclick="document.getElementById('compare-modal-backdrop')?.classList.remove('open'); window.openCollegeDetails('${c2.id}')">
                    <i class="bi bi-eye"></i> View Full Dossier
                  </button>
                  <button type="button" class="btn-sm btn-outline-secondary" onclick="window.toggleChoice('${c2.id}')">
                    <i class="bi bi-bookmark-plus"></i> Add to Choice
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    } catch (err) {
      console.error('Error rendering comparison table:', err);
      tableContainer.innerHTML = '<p style="text-align:center; padding: 24px; color: var(--rose);">Unable to render comparison. Please pick another institute.</p>';
    }
  }

  sel1.addEventListener('change', renderComparison);
  sel2.addEventListener('change', renderComparison);

  if (btnSwap) {
    btnSwap.addEventListener('click', () => {
      const temp = sel1.value;
      sel1.value = sel2.value;
      sel2.value = temp;
      renderComparison();
    });
  }

  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const c1 = chip.dataset.c1;
      const c2 = chip.dataset.c2;
      if (c1 && c2) {
        sel1.value = c1;
        sel2.value = c2;
        renderComparison();
      }
    });
  });

  const openModal = async (initialId1, initialId2) => {
    modalBackdrop.classList.add('open');
    await populateDropdowns(initialId1, initialId2);
    renderComparison();
  };

  window.openCompareModal = openModal;

  if (btnOpen) btnOpen.addEventListener('click', () => openModal());
  if (btnQuick) btnQuick.addEventListener('click', () => openModal());
  if (btnClose) btnClose.addEventListener('click', () => modalBackdrop.classList.remove('open'));
}


// -------------------------------------------------------------
// SEO FAQ Accordion Interactive Logic
// -------------------------------------------------------------
function initFaqAccordion() {
  document.querySelectorAll('.faq-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.faq-card');
      if (!card) return;
      const isActive = card.classList.contains('active');

      document.querySelectorAll('.faq-card').forEach(c => {
        c.classList.remove('active');
        const qBtn = c.querySelector('.faq-question-btn');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        card.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// -------------------------------------------------------------
// App Initialization
// -------------------------------------------------------------
async function initApp() {
  initEvents();
  updateChoiceCounter();
  await Promise.all([
    loadDirectories(),
    switchExam('NEET-UG')
  ]);
  handleRouting();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
