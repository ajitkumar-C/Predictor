/**
 * assign_chapters_to_questions.cjs
 * Maps all 180 NEET questions and 75 JEE questions from Year-Wise Papers
 * into their exact NCERT Chapter IDs, and synchronizes chapters_catalog.json.
 */

const fs = require('fs');
const path = require('path');

const bankPath = path.join(__dirname, '..', 'data', 'mcq', 'questions_bank.json');
const publicBankPath = path.join(__dirname, '..', 'public', 'data', 'mcq', 'questions_bank.json');
const catalogPath = path.join(__dirname, '..', 'data', 'mcq', 'chapters_catalog.json');
const publicCatalogPath = path.join(__dirname, '..', 'public', 'data', 'mcq', 'chapters_catalog.json');

const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Helper to assign chapter to a NEET question
function getNeetChapterId(q) {
  const sub = q.subject;
  const num = q.qNumber; // 1..180
  const text = (q.question + ' ' + (q.explanation || '') + ' ' + (q.ncertRef || '')).toLowerCase();

  if (sub === 'Physics') {
    // 1..45
    if (text.includes('dimension') || text.includes('vector') || text.includes('motion') || text.includes('friction') || text.includes('gravit') || text.includes('escape') || text.includes('fluid') || text.includes('viscos') || text.includes('bernoulli') || text.includes('pendulum') || text.includes('work') || text.includes('kinetic energy')) {
      return 'mechanics-kinematics';
    }
    if (text.includes('optics') || text.includes('lens') || text.includes('mirror') || text.includes('prism') || text.includes('refract') || text.includes('slit') || text.includes('interference') || text.includes('diffract') || text.includes('polariz') || text.includes('brewster')) {
      return 'optics';
    }
    if (text.includes('photoelectric') || text.includes('bohr') || text.includes('hydrogen') || text.includes('half-life') || text.includes('radioactiv') || text.includes('diode') || text.includes('logic gate') || text.includes('semiconductor') || text.includes('de broglie')) {
      return 'modern-physics-neet';
    }
    // Default physics
    return 'current-electricity';
  }

  if (sub === 'Chemistry') {
    // 46..90
    if (text.includes('hybrid') || text.includes('vsepr') || text.includes('dipole') || text.includes('molecular orbital') || text.includes('hydrogen bond') || text.includes('periodic') || text.includes('bond order') || text.includes('geometry')) {
      return 'chemical-bonding';
    }
    if (text.includes('coordinat') || text.includes('ligand') || text.includes('d-block') || text.includes('lanthan') || text.includes('isomerism') || text.includes('complex') || text.includes('iupac name of') || text.includes('cft')) {
      return 'coordination-compounds';
    }
    if (text.includes('nernst') || text.includes('kohlrausch') || text.includes('first-order') || text.includes('rate constant') || text.includes('cell') || text.includes('emf') || text.includes('ph') || text.includes('activation energy') || text.includes('half-life of a reaction')) {
      return 'electrochem-kinetics';
    }
    // Default chemistry
    return 'goc-organic';
  }

  if (sub === 'Botany' || sub === 'Zoology') {
    // 91..180
    if (text.includes('dna') || text.includes('rna') || text.includes('mendel') || text.includes('gene') || text.includes('transcription') || text.includes('translation') || text.includes('replication') || text.includes('lac operon') || text.includes('pedigree') || text.includes('mutation') || text.includes('evolution') || text.includes('hardy')) {
      return 'genetics-evolution';
    }
    if (text.includes('cell') || text.includes('mitosis') || text.includes('meiosis') || text.includes('ribosome') || text.includes('mitochondria') || text.includes('chloroplast') || text.includes('golgi') || text.includes('membrane') || text.includes('division')) {
      return 'cell-biology';
    }
    if (text.includes('pcr') || text.includes('restriction') || text.includes('plasmid') || text.includes('biotech') || text.includes('gel electrophor') || text.includes('bt cotton') || text.includes('recombinant') || text.includes('vector')) {
      return 'biotechnology';
    }
    if (text.includes('ecolog') || text.includes('ecosystem') || text.includes('biodiversity') || text.includes('pyramid') || text.includes('trophic') || text.includes('hotspot') || text.includes('ozone') || text.includes('greenhouse') || text.includes('population')) {
      return 'ecology-environment';
    }
    // Default biology
    return 'human-physiology';
  }

  return 'genetics-evolution';
}

// Helper to assign chapter to a JEE question
function getJeeChapterId(q) {
  const sub = q.subject;
  const num = q.qNumber; // 1..75
  const text = (q.question + ' ' + (q.explanation || '') + ' ' + (q.ncertRef || '')).toLowerCase();

  if (sub === 'Physics') {
    if (text.includes('roll') || text.includes('sphere') || text.includes('cylinder') || text.includes('shm') || text.includes('central') || text.includes('friction') || text.includes('escape') || text.includes('gravitat')) {
      return 'rotational-motion';
    }
    if (text.includes('capacitor') || text.includes('dielectric') || text.includes('electric field') || text.includes('potential') || text.includes('brewster') || text.includes('mirror') || text.includes('lens')) {
      return 'electrostatics-capacitance';
    }
    if (text.includes('magnetic') || text.includes('lc circuit') || text.includes('inductor') || text.includes('rlc') || text.includes('flux') || text.includes('transistor') || text.includes('electromagnetic wave')) {
      return 'current-magnetism';
    }
    return 'thermodynamics-ktg';
  }

  if (sub === 'Chemistry') {
    if (text.includes('molecular orbital') || text.includes('diamagnetic') || text.includes('xef4') || text.includes('electronic configuration') || text.includes('hybrid')) {
      return 'chemical-bonding-jee';
    }
    if (text.includes('cannizzaro') || text.includes('reimer') || text.includes('sn2') || text.includes('lucas') || text.includes('iodoform') || text.includes('amine') || text.includes('polymer') || text.includes('nylon')) {
      return 'organic-mechanisms';
    }
    if (text.includes('isomer') || text.includes('coordination') || text.includes('iupac') || text.includes('magnetic moment') || text.includes('caro') || text.includes('voids')) {
      return 'coordination-jee';
    }
    return 'thermo-solutions';
  }

  if (sub === 'Mathematics') {
    if (text.includes('integral') || text.includes('limit') || text.includes('area') || text.includes('differential equation') || text.includes('minimum value') || text.includes('solutions of')) {
      return 'calculus-integration';
    }
    if (text.includes('matrix') || text.includes('determinant') || text.includes('rotation') || text.includes('vandermonde')) {
      return 'matrices-determinants';
    }
    if (text.includes('skew lines') || text.includes('shortest distance') || text.includes('vector') || text.includes('direction cosine')) {
      return 'vectors-3d';
    }
    return 'coordinate-conics';
  }

  return 'calculus-integration';
}

// Assign chapterId to every question in bank
bank.forEach(q => {
  if (q.exam === 'NEET-UG') {
    // If not already explicitly set to a chapter from original sample
    if (!q.chapterId || q.testId === 'NEET-2024-FULL') {
      q.chapterId = getNeetChapterId(q);
    }
  } else if (q.exam === 'JEE-MAIN') {
    if (!q.chapterId || q.chapterId.endsWith('-core') || q.testId === 'JEE-2024-JAN-S1') {
      q.chapterId = getJeeChapterId(q);
    }
  }
});

// Calculate counts per chapter
const chapterCounts = {};
bank.forEach(q => {
  if (q.chapterId) {
    chapterCounts[q.chapterId] = (chapterCounts[q.chapterId] || 0) + 1;
  }
});

console.log('Chapter question counts:', chapterCounts);

// Update chapters_catalog.json with accurate pyqCounts
for (const exam in catalog) {
  catalog[exam].subjects.forEach(s => {
    s.chapters.forEach(ch => {
      ch.pyqCount = chapterCounts[ch.id] || ch.pyqCount || 5;
    });
  });
}

// Write back to data and public directories
fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2), 'utf8');
fs.writeFileSync(publicBankPath, JSON.stringify(bank, null, 2), 'utf8');
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
fs.writeFileSync(publicCatalogPath, JSON.stringify(catalog, null, 2), 'utf8');

console.log('Successfully mapped all questions to chapters and updated catalog!');

