import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { maharashtraMedicalColleges } from './maharashtra_colleges_data.js';
import { additionalMedicalColleges } from './additional_states_data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// -------------------------------------------------------------
// 1. NEET UG DATASET (AIIMS, JIPMER, Top GMCs, Central/Deemed)
// -------------------------------------------------------------
const neetUGColleges = [
  { name: 'AIIMS New Delhi', city: 'New Delhi', state: 'Delhi', type: 'AIIMS', nirf: 1, baseClosingRank: 57, fees: '₹1,628 / yr' },
  { name: 'Maulana Azad Medical College (MAMC)', city: 'New Delhi', state: 'Delhi', type: 'Govt Medical College', nirf: 32, baseClosingRank: 98, fees: '₹4,445 / yr' },
  { name: 'VMMC & Safdarjung Hospital', city: 'New Delhi', state: 'Delhi', type: 'Central University', nirf: 14, baseClosingRank: 115, fees: '₹33,500 / yr' },
  { name: 'JIPMER Puducherry', city: 'Puducherry', state: 'Puducherry', type: 'Institute of National Importance', nirf: 5, baseClosingRank: 277, fees: '₹14,910 / yr' },
  { name: 'Lady Hardinge Medical College (LHMC)', city: 'New Delhi', state: 'Delhi', type: 'Central (Girls)', nirf: 29, baseClosingRank: 485, fees: '₹3,000 / yr' },
  { name: 'AIIMS Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'AIIMS', nirf: 17, baseClosingRank: 510, fees: '₹1,628 / yr' },
  { name: 'AIIMS Jodhpur', city: 'Jodhpur', state: 'Rajasthan', type: 'AIIMS', nirf: 13, baseClosingRank: 534, fees: '₹1,628 / yr' },
  { name: 'AIIMS Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', type: 'AIIMS', nirf: 22, baseClosingRank: 773, fees: '₹1,628 / yr' },
  { name: 'AIIMS Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', type: 'AIIMS', nirf: 38, baseClosingRank: 618, fees: '₹1,628 / yr' },
  { name: 'Seth GS Medical College (KEM)', city: 'Mumbai', state: 'Maharashtra', type: 'Govt Medical College', nirf: 12, baseClosingRank: 980, fees: '₹1,35,000 / yr' },
  { name: 'King George’s Medical University (KGMU)', city: 'Lucknow', state: 'Uttar Pradesh', type: 'Govt Medical College', nirf: 12, baseClosingRank: 1250, fees: '₹54,900 / yr' },
  { name: 'Madras Medical College (MMC)', city: 'Chennai', state: 'Tamil Nadu', type: 'Govt Medical College', nirf: 11, baseClosingRank: 1320, fees: '₹18,073 / yr' },
  { name: 'Government Medical College (GMCH-32)', city: 'Chandigarh', state: 'Chandigarh', type: 'Govt Medical College', nirf: 27, baseClosingRank: 850, fees: '₹25,000 / yr' },
  { name: 'BJ Medical College', city: 'Ahmedabad', state: 'Gujarat', type: 'Govt Medical College', nirf: 50, baseClosingRank: 1840, fees: '₹25,000 / yr' },
  { name: 'Bangalore Medical College & RI (BMCRI)', city: 'Bengaluru', state: 'Karnataka', type: 'Govt Medical College', nirf: 43, baseClosingRank: 2150, fees: '₹59,850 / yr' },
  { name: 'Grant Government Medical College', city: 'Mumbai', state: 'Maharashtra', type: 'Govt Medical College', nirf: 48, baseClosingRank: 2450, fees: '₹1,25,000 / yr' },
  { name: 'SMS Medical College', city: 'Jaipur', state: 'Rajasthan', type: 'Govt Medical College', nirf: 46, baseClosingRank: 1420, fees: '₹40,000 / yr' },
  { name: 'AIIMS Patna', city: 'Patna', state: 'Bihar', type: 'AIIMS', nirf: 27, baseClosingRank: 1510, fees: '₹1,628 / yr' },
  { name: 'AIIMS Raipur', city: 'Raipur', state: 'Chhattisgarh', type: 'AIIMS', nirf: 39, baseClosingRank: 1280, fees: '₹1,628 / yr' },
  { name: 'Calcutta National Medical College', city: 'Kolkata', state: 'West Bengal', type: 'Govt Medical College', nirf: 35, baseClosingRank: 3950, fees: '₹9,000 / yr' },
  { name: 'Medical College Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Govt Medical College', nirf: 30, baseClosingRank: 2300, fees: '₹9,000 / yr' },
  { name: 'Government Medical College', city: 'Kozhikode', state: 'Kerala', type: 'Govt Medical College', nirf: 40, baseClosingRank: 3100, fees: '₹27,580 / yr' },
  { name: 'Osmania Medical College', city: 'Hyderabad', state: 'Telangana', type: 'Govt Medical College', nirf: 35, baseClosingRank: 4200, fees: '₹30,000 / yr' },
  { name: 'Patna Medical College (PMCH)', city: 'Patna', state: 'Bihar', type: 'Govt Medical College', nirf: 45, baseClosingRank: 4600, fees: '₹21,000 / yr' },
  { name: 'GMC Amritsar', city: 'Amritsar', state: 'Punjab', type: 'Govt Medical College', nirf: 55, baseClosingRank: 5900, fees: '₹80,000 / yr' },
  { name: 'GMC Srinagar', city: 'Srinagar', state: 'Jammu & Kashmir', type: 'Govt Medical College', nirf: 60, baseClosingRank: 6400, fees: '₹26,000 / yr' },
  { name: 'Hamdard Institute of Medical Sciences (HIMSR)', city: 'New Delhi', state: 'Delhi', type: 'Deemed / Minority', nirf: 37, baseClosingRank: 18500, fees: '₹16,00,000 / yr' },
  { name: 'KMC Manipal', city: 'Manipal', state: 'Karnataka', type: 'Deemed University', nirf: 9, baseClosingRank: 24500, fees: '₹17,80,000 / yr' },
  { name: 'Symbiosis Medical College for Women', city: 'Pune', state: 'Maharashtra', type: 'Deemed (Girls)', nirf: 65, baseClosingRank: 48000, fees: '₹10,00,000 / yr' },
  { name: 'DY Patil Medical College', city: 'Navi Mumbai', state: 'Maharashtra', type: 'Deemed University', nirf: 80, baseClosingRank: 185000, fees: '₹26,00,000 / yr' },
  ...maharashtraMedicalColleges.map(c => ({
    name: c.name,
    city: c.city,
    state: 'Maharashtra',
    type: c.type,
    nirf: c.nirf2024 || 50,
    baseClosingRank: c.cutoffRankGen,
    fees: c.annualFees
  })),
  ...additionalMedicalColleges.map(c => ({
    name: c.name,
    city: c.city,
    state: c.state,
    type: c.type,
    nirf: c.nirf2024 || 50,
    baseClosingRank: c.cutoffRankGen,
    fees: c.annualFees
  }))
];

const categoryMultipliers = {
  'OPEN': 1.0,
  'EWS': 1.45,
  'OBC-NCL': 1.55,
  'SC': 6.2,
  'ST': 9.8,
  'PwD': 14.5
};

const quotaList = ['AI', 'HS', 'MM']; // All India Quota, Home State, Management/Deemed

const neetUGData = [];
let idCounter = 1;

neetUGColleges.forEach(col => {
  ['MBBS', 'BDS'].forEach(course => {
    // BDS cutoffs are typically ~2.5x to 3x higher rank than MBBS
    const courseMult = course === 'BDS' ? 2.8 : 1.0;
    if (course === 'BDS' && col.type === 'AIIMS') return; // most AIIMS don't have BDS except Delhi

    Object.keys(categoryMultipliers).forEach(cat => {
      const catMult = categoryMultipliers[cat];
      const round1Close = Math.round(col.baseClosingRank * courseMult * catMult);
      const round2Close = Math.round(round1Close * 1.18);
      const round3Close = Math.round(round2Close * 1.12);

      const quotas = col.type.includes('Deemed') ? ['MM'] : ['AI', 'HS'];
      quotas.forEach(q => {
        // 2024 Round 1 & Round 3
        neetUGData.push({
          id: `NUG-${idCounter++}`,
          exam: 'NEET-UG',
          institute: col.name,
          city: col.city,
          state: col.state,
          type: col.type,
          nirf: col.nirf,
          course: course,
          quota: q,
          category: cat,
          gender: 'Gender-Neutral',
          fees: col.fees,
          r1_closing_2024: round1Close,
          r2_closing_2024: round2Close,
          closing_2024: round3Close,
          closing_2023: Math.round(round3Close * 0.95),
          closing_2022: Math.round(round3Close * 0.91),
          opening_2024: Math.max(1, Math.round(round1Close * 0.45))
        });
      });
    });
  });
});

fs.writeFileSync(path.join(outputDir, 'neet_ug.json'), JSON.stringify(neetUGData, null, 2));
console.log(`Generated NEET UG: ${neetUGData.length} entries`);

// -------------------------------------------------------------
// 2. NEET PG DATASET (MD / MS / DNB Specialties)
// -------------------------------------------------------------
const neetPGColleges = [
  { name: 'AIIMS New Delhi', city: 'New Delhi', state: 'Delhi', type: 'Central / INI', fees: '₹3,000 / yr' },
  { name: 'Maulana Azad Medical College (MAMC)', city: 'New Delhi', state: 'Delhi', type: 'Govt Medical College', fees: '₹15,600 / yr' },
  { name: 'VMMC & Safdarjung Hospital', city: 'New Delhi', state: 'Delhi', type: 'Central University', fees: '₹30,000 / yr' },
  { name: 'PGIMER Chandigarh', city: 'Chandigarh', state: 'Chandigarh', type: 'Central / INI', fees: '₹4,500 / yr' },
  { name: 'King George’s Medical University (KGMU)', city: 'Lucknow', state: 'Uttar Pradesh', type: 'Govt Medical College', fees: '₹42,000 / yr' },
  { name: 'Madras Medical College', city: 'Chennai', state: 'Tamil Nadu', type: 'Govt Medical College', fees: '₹20,000 / yr' },
  { name: 'Seth GS Medical College (KEM)', city: 'Mumbai', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,10,000 / yr' },
  { name: 'Grant Government Medical College & JJ Hospital', city: 'Mumbai', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,10,000 / yr' },
  { name: 'Lokmanya Tilak Municipal Medical College (Sion)', city: 'Mumbai', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,10,000 / yr' },
  { name: 'BJ Government Medical College & Sassoon Hospital', city: 'Pune', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,15,000 / yr' },
  { name: 'Government Medical College (GMC)', city: 'Nagpur', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,05,000 / yr' },
  { name: 'Indira Gandhi Government Medical College (Mayo)', city: 'Nagpur', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,05,000 / yr' },
  { name: 'Government Medical College (GMC)', city: 'Jalgaon', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,05,000 / yr' },
  { name: 'Government Medical College & Hospital', city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', type: 'Govt Medical College', fees: '₹1,05,000 / yr' },
  { name: 'Bangalore Medical College (BMCRI)', city: 'Bengaluru', state: 'Karnataka', type: 'Govt Medical College', fees: '₹65,000 / yr' },
  { name: 'Kasturba Medical College (KMC)', city: 'Manipal', state: 'Karnataka', type: 'Deemed University', fees: '₹22,00,000 / yr' },
  { name: 'Andhra Medical College (AMC)', city: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'Govt Medical College', fees: '₹15,000 / yr' },
  { name: 'Gauhati Medical College & Hospital (GMCH)', city: 'Guwahati', state: 'Assam', type: 'Govt Medical College', fees: '₹25,000 / yr' },
  { name: 'Indira Gandhi Medical College (IGMC)', city: 'Shimla', state: 'Himachal Pradesh', type: 'Govt Medical College', fees: '₹60,000 / yr' },
  { name: 'Goa Medical College (GMC)', city: 'Bambolim', state: 'Goa', type: 'Govt Medical College', fees: '₹1,20,000 / yr' },
  { name: 'Pt. B.D. Sharma PGIMS Rohtak', city: 'Rohtak', state: 'Haryana', type: 'Govt Medical College', fees: '₹65,000 / yr' },
  { name: 'Narayana Hrudayalaya Hospital', city: 'Bengaluru', state: 'Karnataka', type: 'DNB Hospital', fees: '₹1,25,000 / yr' },
  { name: 'Sir Ganga Ram Hospital', city: 'New Delhi', state: 'Delhi', type: 'DNB Hospital', fees: '₹1,25,000 / yr' },
  { name: 'Apollo Hospitals', city: 'Chennai', state: 'Tamil Nadu', type: 'DNB Hospital', fees: '₹1,25,000 / yr' },
  { name: 'Max Super Speciality Hospital', city: 'Saket, New Delhi', state: 'Delhi', type: 'DNB Hospital', fees: '₹1,25,000 / yr' }
];

const specialties = [
  { branch: 'MD Radio-Diagnosis', tierRank: 400 },
  { branch: 'MD General Medicine', tierRank: 950 },
  { branch: 'MD Dermatology (DVL)', tierRank: 1200 },
  { branch: 'MD Paediatrics', tierRank: 3200 },
  { branch: 'MS Obstetrics & Gynaecology', tierRank: 4800 },
  { branch: 'MS Orthopaedics', tierRank: 5500 },
  { branch: 'MS General Surgery', tierRank: 6800 },
  { branch: 'MD Anaesthesiology', tierRank: 14500 },
  { branch: 'MD Pathology', tierRank: 24000 },
  { branch: 'MD Community Medicine (PSM)', tierRank: 38000 }
];

const neetPGData = [];
let pgId = 1;

neetPGColleges.forEach((col, cIdx) => {
  specialties.forEach(spec => {
    // Stagger college tier
    const collegeMultiplier = 1 + (cIdx * 0.35);
    const baseRank = Math.round(spec.tierRank * collegeMultiplier);

    ['OPEN', 'OBC-NCL', 'EWS', 'SC', 'ST'].forEach(cat => {
      const catMult = categoryMultipliers[cat] || 1;
      const closing = Math.round(baseRank * (cat === 'OPEN' ? 1 : (cat === 'EWS' ? 1.3 : (cat === 'OBC-NCL' ? 1.4 : (cat === 'SC' ? 3.5 : 5.8)))));
      const quota = col.type.includes('DNB') ? 'DNB' : 'AIQ 50%';

      neetPGData.push({
        id: `NPG-${pgId++}`,
        exam: 'NEET-PG',
        institute: col.name,
        city: col.city,
        state: col.state,
        type: col.type,
        course: spec.branch,
        quota: quota,
        category: cat,
        fees: col.fees,
        closing_2024: closing,
        closing_2023: Math.round(closing * 0.94),
        closing_2022: Math.round(closing * 0.89),
        opening_2024: Math.max(1, Math.round(closing * 0.35))
      });
    });
  });
});

fs.writeFileSync(path.join(outputDir, 'neet_pg.json'), JSON.stringify(neetPGData, null, 2));
console.log(`Generated NEET PG: ${neetPGData.length} entries`);

// -------------------------------------------------------------
// 3. JEE ADVANCED DATASET (ALL 23 IITs)
// -------------------------------------------------------------
const iits = [
  { name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', tier: 1, baseRank: 66 },
  { name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', tier: 1, baseRank: 115 },
  { name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', tier: 1, baseRank: 148 },
  { name: 'IIT Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', tier: 1, baseRank: 215 },
  { name: 'IIT Kharagpur', city: 'Kharagpur', state: 'West Bengal', tier: 1, baseRank: 260 },
  { name: 'IIT Roorkee', city: 'Roorkee', state: 'Uttarakhand', tier: 2, baseRank: 412 },
  { name: 'IIT Guwahati', city: 'Guwahati', state: 'Assam', tier: 2, baseRank: 600 },
  { name: 'IIT Hyderabad', city: 'Hyderabad', state: 'Telangana', tier: 2, baseRank: 620 },
  { name: 'IIT (BHU) Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', tier: 2, baseRank: 1050 },
  { name: 'IIT Indore', city: 'Indore', state: 'Madhya Pradesh', tier: 3, baseRank: 1350 },
  { name: 'IIT Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', tier: 3, baseRank: 1550 },
  { name: 'IIT Ropar', city: 'Rupnagar', state: 'Punjab', tier: 3, baseRank: 1850 },
  { name: 'IIT (ISM) Dhanbad', city: 'Dhanbad', state: 'Jharkhand', tier: 3, baseRank: 3200 },
  { name: 'IIT Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', tier: 3, baseRank: 3100 },
  { name: 'IIT Mandi', city: 'Mandi', state: 'Himachal Pradesh', tier: 3, baseRank: 2900 },
  { name: 'IIT Jodhpur', city: 'Jodhpur', state: 'Rajasthan', tier: 3, baseRank: 2750 },
  { name: 'IIT Patna', city: 'Patna', state: 'Bihar', tier: 3, baseRank: 2800 },
  { name: 'IIT Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', tier: 4, baseRank: 4200 },
  { name: 'IIT Palakkad', city: 'Palakkad', state: 'Kerala', tier: 4, baseRank: 4600 },
  { name: 'IIT Goa', city: 'Farmagudi', state: 'Goa', tier: 4, baseRank: 4900 },
  { name: 'IIT Dharwad', city: 'Dharwad', state: 'Karnataka', tier: 4, baseRank: 5200 },
  { name: 'IIT Bhilai', city: 'Bhilai', state: 'Chhattisgarh', tier: 4, baseRank: 5600 },
  { name: 'IIT Jammu', city: 'Jammu', state: 'Jammu & Kashmir', tier: 4, baseRank: 5900 }
];

const iitBranches = [
  { branch: 'Computer Science and Engineering (4 Years, B.Tech)', short: 'CSE', factor: 1.0 },
  { branch: 'Data Science and Artificial Intelligence (4 Years, B.Tech)', short: 'AI & DS', factor: 1.4 },
  { branch: 'Electrical Engineering (4 Years, B.Tech)', short: 'EE', factor: 2.2 },
  { branch: 'Mechanical Engineering (4 Years, B.Tech)', short: 'ME', factor: 3.8 },
  { branch: 'Chemical Engineering (4 Years, B.Tech)', short: 'CHE', factor: 5.2 },
  { branch: 'Civil Engineering (4 Years, B.Tech)', short: 'CE', factor: 6.5 },
  { branch: 'Metallurgical Engineering and Materials Science (4 Years, B.Tech)', short: 'MME', factor: 7.8 }
];

const jeeAdvData = [];
let advId = 1;

iits.forEach(iit => {
  iitBranches.forEach(br => {
    ['Gender-Neutral', 'Female-only (supernumerary)'].forEach(gender => {
      const genderMult = gender.includes('Female') ? 1.6 : 1.0;

      ['OPEN', 'EWS', 'OBC-NCL', 'SC', 'ST'].forEach(cat => {
        const catMult = cat === 'OPEN' ? 1.0 : (cat === 'EWS' ? 1.35 : (cat === 'OBC-NCL' ? 1.5 : (cat === 'SC' ? 2.8 : 4.0)));
        const closing = Math.round(iit.baseRank * br.factor * genderMult * (cat === 'OPEN' ? 1.0 : catMult * 0.45)); 
        // Note: JoSAA publishes Category Ranks for reserved categories, so ranks are in category ranks
        const opening = Math.max(1, Math.round(closing * 0.4));

        jeeAdvData.push({
          id: `JADV-${advId++}`,
          exam: 'JEE-ADVANCED',
          institute: iit.name,
          city: iit.city,
          state: iit.state,
          course: br.branch,
          shortBranch: br.short,
          type: 'IIT',
          quota: 'AI',
          category: cat,
          gender: gender,
          fees: '₹2,25,000 / yr',
          closing_2024: closing,
          closing_2023: Math.round(closing * 0.96),
          closing_2022: Math.round(closing * 0.92),
          opening_2024: opening
        });
      });
    });
  });
});

fs.writeFileSync(path.join(outputDir, 'jee_adv.json'), JSON.stringify(jeeAdvData, null, 2));
console.log(`Generated JEE Advanced: ${jeeAdvData.length} entries`);

// -------------------------------------------------------------
// 4. JEE MAIN DATASET (NITs, IIITs, GFTIs)
// -------------------------------------------------------------
const nitsAndIiits = [
  { name: 'NIT Tiruchirappalli (Trichy)', city: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'NIT', baseRank: 1200 },
  { name: 'NIT Karnataka (Surathkal)', city: 'Surathkal', state: 'Karnataka', type: 'NIT', baseRank: 1650 },
  { name: 'NIT Warangal', city: 'Warangal', state: 'Telangana', type: 'NIT', baseRank: 2100 },
  { name: 'NIT Rourkela', city: 'Rourkela', state: 'Odisha', type: 'NIT', baseRank: 3200 },
  { name: 'Motilal Nehru National Institute of Technology (MNNIT Allahabad)', city: 'Prayagraj', state: 'Uttar Pradesh', type: 'NIT', baseRank: 3900 },
  { name: 'Malaviya National Institute of Technology (MNIT Jaipur)', city: 'Jaipur', state: 'Rajasthan', type: 'NIT', baseRank: 4400 },
  { name: 'Visvesvaraya National Institute of Technology (VNIT Nagpur)', city: 'Nagpur', state: 'Maharashtra', type: 'NIT', baseRank: 4800 },
  { name: 'NIT Calicut', city: 'Kozhikode', state: 'Kerala', type: 'NIT', baseRank: 4500 },
  { name: 'NIT Kurukshetra', city: 'Kurukshetra', state: 'Haryana', type: 'NIT', baseRank: 5900 },
  { name: 'NIT Durgapur', city: 'Durgapur', state: 'West Bengal', type: 'NIT', baseRank: 7800 },
  { name: 'NIT Silchar', city: 'Silchar', state: 'Assam', type: 'NIT', baseRank: 10500 },
  { name: 'NIT Patna', city: 'Patna', state: 'Bihar', type: 'NIT', baseRank: 12500 },
  { name: 'NIT Jalandhar', city: 'Jalandhar', state: 'Punjab', type: 'NIT', baseRank: 9500 },
  { name: 'NIT Raipur', city: 'Raipur', state: 'Chhattisgarh', type: 'NIT', baseRank: 11000 },
  { name: 'NIT Meghalaya', city: 'Shillong', state: 'Meghalaya', type: 'NIT', baseRank: 18000 },
  { name: 'IIIT Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', type: 'IIIT', baseRank: 4900 },
  { name: 'IIITM Gwalior', city: 'Gwalior', state: 'Madhya Pradesh', type: 'IIIT', baseRank: 6800 },
  { name: 'IIIT Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', type: 'IIIT', baseRank: 12500 },
  { name: 'IIIT Kancheepuram', city: 'Chennai', state: 'Tamil Nadu', type: 'IIIT', baseRank: 15500 },
  { name: 'IIIT Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', type: 'IIIT', baseRank: 8900 },
  { name: 'IIIT Pune', city: 'Pune', state: 'Maharashtra', type: 'IIIT', baseRank: 14000 },
  { name: 'Punjab Engineering College (PEC Chandigarh)', city: 'Chandigarh', state: 'Chandigarh', type: 'GFTI', baseRank: 10500 },
  { name: 'BIT Mesra', city: 'Ranchi', state: 'Jharkhand', type: 'GFTI', baseRank: 15500 },
  { name: 'IIEST Shibpur', city: 'Howrah', state: 'West Bengal', type: 'GFTI', baseRank: 13500 }
];

const nitBranches = [
  { branch: 'Computer Science and Engineering (4 Years, B.Tech)', short: 'CSE', factor: 1.0 },
  { branch: 'Information Technology (4 Years, B.Tech)', short: 'IT', factor: 1.3 },
  { branch: 'Electronics and Communication Engineering (4 Years, B.Tech)', short: 'ECE', factor: 1.8 },
  { branch: 'Electrical and Electronics Engineering (4 Years, B.Tech)', short: 'EEE', factor: 2.6 },
  { branch: 'Mechanical Engineering (4 Years, B.Tech)', short: 'ME', factor: 3.9 },
  { branch: 'Civil Engineering (4 Years, B.Tech)', short: 'CE', factor: 5.5 }
];

const jeeMainData = [];
let mainId = 1;

nitsAndIiits.forEach(inst => {
  nitBranches.forEach(br => {
    // IIITs usually only have CSE, IT, ECE
    if (inst.type === 'IIIT' && !['CSE', 'IT', 'ECE'].includes(br.short)) return;

    ['Gender-Neutral', 'Female-only (supernumerary)'].forEach(gender => {
      const genderMult = gender.includes('Female') ? 1.5 : 1.0;
      const quotas = inst.type === 'NIT' ? ['HS', 'OS'] : ['AI'];

      quotas.forEach(q => {
        // Home state cutoffs are typically more relaxed (higher rank number)
        const quotaMult = q === 'HS' ? 1.45 : 1.0;

        ['OPEN', 'EWS', 'OBC-NCL', 'SC', 'ST'].forEach(cat => {
          const closing = Math.round(inst.baseRank * br.factor * genderMult * quotaMult * (cat === 'OPEN' ? 1.0 : (cat === 'EWS' ? 1.3 : (cat === 'OBC-NCL' ? 1.45 : (cat === 'SC' ? 2.5 : 3.8)))));
          const opening = Math.max(1, Math.round(closing * 0.45));

          jeeMainData.push({
            id: `JMAIN-${mainId++}`,
            exam: 'JEE-MAIN',
            institute: inst.name,
            city: inst.city,
            state: inst.state,
            course: br.branch,
            shortBranch: br.short,
            type: inst.type,
            quota: q,
            category: cat,
            gender: gender,
            fees: inst.type === 'NIT' ? '₹1,45,000 / yr' : (inst.type === 'IIIT' ? '₹1,95,000 / yr' : '₹1,60,000 / yr'),
            closing_2024: closing,
            closing_2023: Math.round(closing * 0.95),
            closing_2022: Math.round(closing * 0.90),
            opening_2024: opening
          });
        });
      });
    });
  });
});

fs.writeFileSync(path.join(outputDir, 'jee_main.json'), JSON.stringify(jeeMainData, null, 2));
console.log(`Generated JEE Main: ${jeeMainData.length} entries`);

console.log('All 4 exam datasets generated successfully!');
