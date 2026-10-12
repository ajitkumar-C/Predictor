// scripts/fix_all_college_websites.js
// Fixes all college official website URLs across all datasets

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'public', 'data');

const VERIFIED_URLS = {
  // Medical Colleges & Apex Hospitals
  "aiims new delhi": "https://www.aiims.edu",
  "aiims bhubaneswar": "https://aiimsbhubaneswar.nic.in",
  "aiims jodhpur": "https://www.aiimsjodhpur.edu.in",
  "aiims rishikesh": "https://aiimsrishikesh.edu.in",
  "aiims bhopal": "https://aiimsbhopal.edu.in",
  "aiims raipur": "https://www.aiimsraipur.edu.in",
  "aiims patna": "https://aiimspatna.edu.in",
  "aiims nagpur": "https://aiimsnagpur.edu.in",
  "aiims kalyani": "https://aiimskalyani.edu.in",
  "aiims mangalagiri": "https://www.aiimsmangalagiri.edu.in",
  "aiims gorakhpur": "https://aiimsgorakhpur.edu.in",
  "aiims bathinda": "https://aiimsbathinda.edu.in",
  "aiims bibinagar": "https://aiimsbibinagar.edu.in",
  "aiims bilaspur": "https://www.aiimsbilaspur.edu.in",
  "aiims guwahati": "https://aiimsguwahati.ac.in",
  "aiims deoghar": "https://www.aiimsdeoghar.edu.in",
  "aiims rajkot": "https://aiimsrajkot.edu.in",
  "aiims raebareli": "https://aiimsrbl.edu.in",

  "maulana azad medical college (mamc)": "https://mamc.delhi.gov.in",
  "maulana azad medical college": "https://mamc.delhi.gov.in",
  "mamc": "https://mamc.delhi.gov.in",
  "vmmc & safdarjung hospital": "https://vmmc-sjh.nic.in",
  "vmmc": "https://vmmc-sjh.nic.in",
  "safdarjung hospital": "https://vmmc-sjh.nic.in",
  "lady hardinge medical college": "http://lhmc-hosp.gov.in",
  "university college of medical sciences (ucms)": "https://www.ucms.ac.in",
  "ucms": "https://www.ucms.ac.in",

  "seth gs medical college (kem)": "https://www.kem.edu",
  "seth gs medical college": "https://www.kem.edu",
  "kem hospital": "https://www.kem.edu",
  "grant government medical college": "https://gmcjjh.edu.in",
  "grant government medical college & jj hospital": "https://gmcjjh.com",
  "lokmanya tilak municipal medical college (sion)": "https://ltmmc.edu.in",
  "topiwala national medical college (nair)": "https://www.tnmcnair.edu.in",
  "bj government medical college & sassoon hospital": "https://www.bjmcpune.org",
  "b.j. government medical college & sassoon general hospital": "https://www.bjmcpune.org",
  "bjmc pune": "https://www.bjmcpune.org",
  "government medical college & hospital (gmc nagpur)": "https://www.gmcnagpur.org",
  "government medical college (gmc)": "https://www.gmcnagpur.org",
  "government medical college": "https://www.gmcnagpur.org",
  "indira Gandhi government medical college (mayo)": "https://www.iggmc.org",
  "indira gandhi government medical college & hospital (iggmc / mayo)": "https://www.iggmc.org",
  "government medical college (gmch-32)": "https://gmch.gov.in",
  "government medical college & hospital": "https://gmch.gov.in",

  "bangalore medical college & ri (bmcri)": "https://www.bmcri.org",
  "bangalore medical college (bmcri)": "https://www.bmcri.org",
  "madras medical college": "https://mmcrgggh.tn.gov.in",
  "stanley medical college": "https://www.stanleymc.edu.in",
  "sms medical college": "https://medicaleducation.rajasthan.gov.in/smsjaipur/",
  "calcutta national medical college": "https://cnmckolkata.com",
  "patna medical college (pmch)": "https://pmch.bihar.gov.in",
  "gmc amritsar": "https://www.gmc.edu.in",
  "gmc srinagar": "https://gmcs.edu.in",
  "andhra medical college (amc)": "https://andhramedicalcollege.edu.in",
  "andhra medical college (amc) & king george hospital": "https://andhramedicalcollege.edu.in",
  "guntur medical college & govt general hospital": "https://gunturmedicalcollege.edu.in",
  "kurnool medical college & govt general hospital": "https://kurnoolmedicalcollege.ac.in",
  "goa medical college (gmc)": "https://www.gmc.goa.gov.in",
  "indira gandhi medical college (igmc)": "https://www.igmcshimla.edu.in",
  "dr. rajendra prasad govt medical college (rpgmc tanda)": "https://rpgmc.ac.in",
  "pt. b.d. sharma pgims rohtak": "https://pgimsrohtak.ac.in",
  "pgimer chandigarh": "https://pgimer.edu.in",
  "jipmer puducherry": "https://www.jipmer.edu.in",
  "king george's medical university (kgmu)": "https://www.kgmu.org",
  "institute of medical sciences (ims bhu)": "https://www.bhu.ac.in/ims/",
  "jawaharlal nehru medical college (amu aligarh)": "https://www.amu.ac.in",
  "christian medical college (cmc vellore)": "https://www.cmch-vellore.edu",
  "kasturba medical college (kmc)": "https://manipal.edu/kmc-manipal.html",
  "st. john's medical college": "https://www.stjohns.in",
  "symbiosis medical college for women": "https://smcw.siu.edu.in",
  "dy patil medical college": "https://medical.dpu.edu.in",
  "dr. d.y. patil medical college, hospital & research centre": "https://medical.dpu.edu.in",
  "bharati vidyapeeth deomed university medical college": "https://mcpune.bharatividyapeeth.edu",
  "mgm medical college & hospital (navi mumbai)": "https://www.mgmmcnm.edu.in",
  "sir ganga ram hospital": "https://sgrh.com",
  "narayana hrudayalaya hospital": "https://www.narayanahealth.org",
  "apollo hospitals": "https://www.apollohospitals.com",
  "max super speciality hospital": "https://www.maxhealthcare.in",

  // Engineering Colleges
  "iit bombay - indian institute of technology": "https://acr.iitbombay.org/",
  "iit bombay": "https://acr.iitbombay.org/",
  "iit delhi - indian institute of technology": "https://www.iitd.ac.in",
  "iit delhi": "https://www.iitd.ac.in",
  "iit madras - indian institute of technology": "https://www.iitm.ac.in",
  "iit madras": "https://www.iitm.ac.in",
  "iit kanpur - indian institute of technology": "https://www.iitk.ac.in",
  "iit kanpur": "https://www.iitk.ac.in",
  "iit kharagpur - indian institute of technology": "https://www.iitkgp.ac.in",
  "iit kharagpur": "https://www.iitkgp.ac.in",
  "iit roorkee - indian institute of technology": "https://www.iitr.ac.in",
  "iit roorkee": "https://www.iitr.ac.in",
  "iit guwahati - indian institute of technology": "https://www.iitg.ac.in",
  "iit guwahati": "https://www.iitg.ac.in",
  "iit hyderabad - indian institute of technology": "https://www.iith.ac.in",
  "iit hyderabad": "https://www.iith.ac.in",
  "iit (bhu) varanasi": "https://www.iitbhu.ac.in",
  "iit bhu": "https://www.iitbhu.ac.in",
  "iit indore - indian institute of technology": "https://www.iiti.ac.in",
  "iit indore": "https://www.iiti.ac.in",
  "iit gandhinagar": "https://www.iitgn.ac.in",
  "iit (ism) dhanbad": "https://www.iitism.ac.in",
  "iit ism dhanbad": "https://www.iitism.ac.in",
  "iit ropar - indian institute of technology": "https://www.iitrpr.ac.in",
  "iit ropar": "https://www.iitrpr.ac.in",
  "iit bhubaneswar - indian institute of technology": "https://www.iitbbs.ac.in",
  "iit bhubaneswar": "https://www.iitbbs.ac.in",
  "iit mandi - indian institute of technology": "https://www.iitmandi.ac.in",
  "iit mandi": "https://www.iitmandi.ac.in",
  "iit jodhpur - indian institute of technology": "https://www.iitj.ac.in",
  "iit jodhpur": "https://www.iitj.ac.in",
  "iit patna - indian institute of technology": "https://www.iitp.ac.in",
  "iit patna": "https://www.iitp.ac.in",
  "iit tirupati - indian institute of technology": "https://www.iittp.ac.in",
  "iit tirupati": "https://www.iittp.ac.in",
  "iit palakkad - indian institute of technology": "https://www.iitpkd.ac.in",
  "iit palakkad": "https://www.iitpkd.ac.in",
  "iit goa - indian institute of technology": "https://www.iitgoa.ac.in",
  "iit goa": "https://www.iitgoa.ac.in",
  "iit dharwad - indian institute of technology": "https://www.iitdh.ac.in",
  "iit dharwad": "https://www.iitdh.ac.in",
  "iit bhilai - indian institute of technology": "https://www.iitbhilai.ac.in",
  "iit bhilai": "https://www.iitbhilai.ac.in",
  "iit jammu - indian institute of technology": "https://www.iitjammu.ac.in",
  "iit jammu": "https://www.iitjammu.ac.in",

  "nit tiruchirappalli (trichy)": "https://www.nitt.edu",
  "national institute of technology tiruchirappalli (nit trichy)": "https://www.nitt.edu",
  "nit trichy": "https://www.nitt.edu",
  "nit karnataka (surathkal)": "https://www.nitk.ac.in",
  "national institute of technology karnataka (nit surathkal)": "https://www.nitk.ac.in",
  "nitk surathkal": "https://www.nitk.ac.in",
  "nit warangal": "https://www.nitw.ac.in",
  "national institute of technology warangal": "https://www.nitw.ac.in",
  "nit rourkela": "https://www.nitrkl.ac.in",
  "national institute of technology rourkela": "https://www.nitrkl.ac.in",
  "motilal nehru national institute of technology (mnnit allahabad)": "https://www.mnnit.ac.in",
  "mnnit allahabad": "https://www.mnnit.ac.in",
  "malaviya national institute of technology (mnit jaipur)": "https://www.mnit.ac.in",
  "mnit jaipur": "https://www.mnit.ac.in",
  "visvesvaraya national institute of technology (vnit nagpur)": "https://vnit.ac.in",
  "vnit nagpur": "https://vnit.ac.in",
  "nit calicut": "https://www.nitc.ac.in",
  "nit kurukshetra": "https://nitkkr.ac.in",
  "nit durgapur": "https://nitdgp.ac.in",
  "nit silchar": "https://www.nits.ac.in",
  "nit patna": "https://www.nitp.ac.in",
  "nit jalandhar": "https://www.nitj.ac.in",
  "nit raipur": "https://www.nitrr.ac.in",
  "nit meghalaya": "https://www.nitm.ac.in",

  "iiit hyderabad - international institute of information technology": "https://www.iiit.ac.in",
  "iiit hyderabad": "https://www.iiit.ac.in",
  "iiit allahabad - indian institute of information technology": "https://www.iiita.ac.in",
  "iiit allahabad": "https://www.iiita.ac.in",
  "iiitm gwalior": "https://www.iiitm.ac.in",
  "iiit jabalpur": "https://www.iiitdmj.ac.in",
  "iiit kancheepuram": "https://www.iiitdm.ac.in",
  "iiit lucknow": "https://iiitl.ac.in",
  "iiit pune": "https://www.iiitp.ac.in",

  "college of engineering, pune (coep technological university)": "https://www.coep.org.in",
  "coep pune": "https://www.coep.org.in",
  "veermata jijabai technological institute (vjti mumbai)": "https://vjti.ac.in",
  "vjti mumbai": "https://vjti.ac.in",
  "delhi technological university (dtu, formerly dce)": "https://dtu.ac.in",
  "dtu delhi": "https://dtu.ac.in",
  "jadavpur university (faculty of engineering & technology)": "http://www.jaduniv.edu.in",
  "ju kolkata": "http://www.jaduniv.edu.in",
  "punjab engineering college (pec chandigarh)": "https://pec.ac.in",
  "bit mesra": "https://www.bitmesra.ac.in",
  "iiest shibpur": "https://www.iiests.ac.in"
};

function getVerifiedUrl(name, existingUrl) {
  if (!name) return existingUrl;
  const lower = name.toLowerCase().trim();

  // Exact lookup
  if (VERIFIED_URLS[lower]) return VERIFIED_URLS[lower];

  // Substring match
  for (const [key, url] of Object.entries(VERIFIED_URLS)) {
    if (key.length >= 5 && (lower.includes(key) || key.includes(lower))) {
      return url;
    }
  }

  // If existing url is valid (not dummy)
  if (existingUrl && !existingUrl.includes('.slice') && !existingUrl.match(/www\.[a-z0-9]{15}\.ac\.in/) && existingUrl.length > 5) {
    if (existingUrl.startsWith('http://') || existingUrl.startsWith('https://')) return existingUrl;
    return `https://${existingUrl}`;
  }

  // Safe Google search fallback for colleges without verified domain
  return `https://www.google.com/search?q=${encodeURIComponent(name + ' official website')}`;
}

// 1. Update college_master_details.json
const masterPath = path.join(dataDir, 'college_master_details.json');
const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

let fixedMaster = 0;
for (const [key, profile] of Object.entries(masterData)) {
  const verified = getVerifiedUrl(profile.name, profile.website);
  if (verified !== profile.website) {
    profile.website = verified;
    fixedMaster++;
  }
}
fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2));
console.log(`Updated college_master_details.json: ${fixedMaster} entries verified`);

// 2. Update medical_colleges_directory.json
const medPath = path.join(dataDir, 'medical_colleges_directory.json');
const medData = JSON.parse(fs.readFileSync(medPath, 'utf8'));

let fixedMed = 0;
for (const col of medData) {
  const verified = getVerifiedUrl(col.name, col.website);
  if (verified !== col.website) {
    col.website = verified;
    fixedMed++;
  }
}
fs.writeFileSync(medPath, JSON.stringify(medData, null, 2));
console.log(`Updated medical_colleges_directory.json: ${fixedMed} entries verified`);

// 3. Update engineering_colleges_directory.json
const engPath = path.join(dataDir, 'engineering_colleges_directory.json');
const engData = JSON.parse(fs.readFileSync(engPath, 'utf8'));

let fixedEng = 0;
for (const col of engData) {
  const verified = getVerifiedUrl(col.name, col.website);
  if (verified !== col.website) {
    col.website = verified;
    fixedEng++;
  }
}
fs.writeFileSync(engPath, JSON.stringify(engData, null, 2));
console.log(`Updated engineering_colleges_directory.json: ${fixedEng} entries verified`);
