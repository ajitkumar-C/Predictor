const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'data', 'mcq', 'chapters_catalog.json');
const bankPath = path.join(__dirname, '..', 'data', 'mcq', 'questions_bank.json');
const publicBankPath = path.join(__dirname, '..', 'public', 'data', 'mcq', 'questions_bank.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
let existingBank = [];
if (fs.existsSync(bankPath)) {
  existingBank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
}

// Add high-yield authentic PYQs for every remaining chapter
const additionalQuestions = [
  // NEET Biology: Cell Biology
  {
    id: "NEET-BIO-CELL-2024-Q1",
    exam: "NEET-UG",
    subject: "Biology",
    chapterId: "cell-biology",
    year: 2024,
    difficulty: "Easy",
    question: "During which phase of the cell cycle do homologous chromosomes undergo pairing (synapsis) and crossing over?",
    options: [
      { id: "A", text: "Leptotene" },
      { id: "B", text: "Zygotene and Pachytene respectively" },
      { id: "C", text: "Diplotene" },
      { id: "D", text: "Metaphase I" }
    ],
    correct: "B",
    explanation: "Synapsis (pairing of homologous chromosomes with synaptonemal complex formation) occurs in Zygotene, while crossing over (recombination mediated by recombinase enzyme) occurs in Pachytene stage of Prophase I.",
    ncertRef: "NCERT Class 11, Chapter 10: Cell Cycle and Cell Division, Section 10.2.1"
  },
  {
    id: "NEET-BIO-CELL-2023-Q2",
    exam: "NEET-UG",
    subject: "Biology",
    chapterId: "cell-biology",
    year: 2023,
    difficulty: "Moderate",
    question: "Which of the following cellular organelles possesses its own circular 70S ribosomes and double-stranded DNA?",
    options: [
      { id: "A", text: "Endoplasmic Reticulum and Golgi apparatus" },
      { id: "B", text: "Lysosomes and Peroxisomes" },
      { id: "C", text: "Mitochondria and Chloroplasts" },
      { id: "D", text: "Nucleolus and Ribosomes" }
    ],
    correct: "C",
    explanation: "Mitochondria and chloroplasts are semi-autonomous endosymbiotic organelles possessing double-stranded circular DNA and 70S ribosomes, capable of self-replication and protein synthesis.",
    ncertRef: "NCERT Class 11, Chapter 8: Cell: The Unit of Life, Section 8.5.3"
  },

  // NEET Biology: Biotechnology
  {
    id: "NEET-BIO-BIOTECH-2024-Q1",
    exam: "NEET-UG",
    subject: "Biology",
    chapterId: "biotechnology",
    year: 2024,
    difficulty: "Easy",
    question: "In recombinant DNA technology, the enzyme used for joining the foreign DNA fragment to the cloning vector plasmid is:",
    options: [
      { id: "A", text: "DNA Ligase" },
      { id: "B", text: "DNA Polymerase III" },
      { id: "C", text: "EcoRI Restriction Endonuclease" },
      { id: "D", text: "Alkaline Phosphatase" }
    ],
    correct: "A",
    explanation: "DNA Ligase forms phosphodiester bonds between adjacent 3'-OH and 5'-phosphate ends of DNA fragments, sealing the nick to produce recombinant DNA.",
    ncertRef: "NCERT Class 12, Chapter 11: Biotechnology Principles & Processes, Section 11.2"
  },
  {
    id: "NEET-BIO-BIOTECH-2023-Q2",
    exam: "NEET-UG",
    subject: "Biology",
    chapterId: "biotechnology",
    year: 2023,
    difficulty: "Moderate",
    question: "Bt toxin proteins produced by Bacillus thuringiensis do not kill the bacteria itself because:",
    options: [
      { id: "A", text: "The bacteria has a thick impervious cell wall" },
      { id: "B", text: "The toxin exists as an inactive protoxin in bacteria" },
      { id: "C", text: "The bacteria produces an antitoxin enzyme" },
      { id: "D", text: "The toxin activates only at acidic pH in mammalian stomachs" }
    ],
    correct: "B",
    explanation: "The Bt toxin protein exists as an inactive protoxin within the bacterium. Once an insect ingests it, the alkaline pH of the insect gut solubilizes the crystals and converts the protoxin to an active toxin form, which binds epithelial cells creating pores.",
    ncertRef: "NCERT Class 12, Chapter 12: Biotechnology and its Applications, Section 12.2"
  },

  // NEET Biology: Ecology & Environment
  {
    id: "NEET-BIO-ECOL-2024-Q1",
    exam: "NEET-UG",
    subject: "Biology",
    chapterId: "ecology-environment",
    year: 2024,
    difficulty: "Easy",
    question: "Which ecological pyramid is ALWAYS upright and can never be inverted under any ecosystem conditions?",
    options: [
      { id: "A", text: "Pyramid of Number" },
      { id: "B", text: "Pyramid of Biomass" },
      { id: "C", text: "Pyramid of Energy" },
      { id: "D", text: "Pyramid of Secondary Productivity" }
    ],
    correct: "C",
    explanation: "The pyramid of energy is always upright because energy is lost as heat at each trophic step in accordance with Lindeman's 10% law of energy transfer; hence energy available to successive levels continuously diminishes.",
    ncertRef: "NCERT Class 12, Chapter 14: Ecosystem, Section 14.4"
  },

  // NEET Physics: Mechanics & Kinematics
  {
    id: "NEET-PHY-MECH-2024-Q1",
    exam: "NEET-UG",
    subject: "Physics",
    chapterId: "mechanics-kinematics",
    year: 2024,
    difficulty: "Moderate",
    question: "A projectile is thrown with speed u at an angle of 30° with the horizontal. At the highest point of its trajectory, what is its speed and acceleration?",
    options: [
      { id: "A", text: "Speed = 0, Acceleration = g downwards" },
      { id: "B", text: "Speed = u * cos(30°), Acceleration = g downwards" },
      { id: "C", text: "Speed = u * sin(30°), Acceleration = 0" },
      { id: "D", text: "Speed = u * cos(30°), Acceleration = 0" }
    ],
    correct: "B",
    explanation: "At the maximum height of projectile motion, the vertical component of velocity is zero (vy = 0), leaving only the horizontal component vx = u * cos(30°) = u * sqrt(3)/2. The gravitational acceleration g acts vertically downwards throughout.",
    ncertRef: "NCERT Class 11, Chapter 4: Motion in a Plane, Section 4.10"
  },

  // NEET Physics: Optics
  {
    id: "NEET-PHY-OPT-2024-Q1",
    exam: "NEET-UG",
    subject: "Physics",
    chapterId: "optics",
    year: 2024,
    difficulty: "Easy",
    question: "A convex lens of focal length 20 cm in air is submerged in water (refractive index 4/3). Given the refractive index of glass is 1.5, the new focal length in water will be:",
    options: [
      { id: "A", text: "40 cm" },
      { id: "B", text: "80 cm" },
      { id: "C", text: "20 cm" },
      { id: "D", text: "10 cm" }
    ],
    correct: "B",
    explanation: "Using Lens Maker's Formula: 1/f = (μ_lens/μ_med - 1)(1/R1 - 1/R2). In air: 1/20 = (1.5 - 1) * K = 0.5 * K => K = 1/10. In water: 1/f_w = (1.5 / (4/3) - 1) * K = (9/8 - 1) * (1/10) = (1/80). Hence f_w = 80 cm (increases by 4 times).",
    ncertRef: "NCERT Class 12, Chapter 9: Ray Optics and Optical Instruments, Section 9.5"
  },

  // NEET Physics: Modern Physics
  {
    id: "NEET-PHY-MOD-2024-Q1",
    exam: "NEET-UG",
    subject: "Physics",
    chapterId: "modern-physics-neet",
    year: 2024,
    difficulty: "Easy",
    question: "According to de Broglie hypothesis, if the kinetic energy of an electron is doubled, its de Broglie wavelength changes by a factor of:",
    options: [
      { id: "A", text: "2" },
      { id: "B", text: "1 / 2" },
      { id: "C", text: "1 / sqrt(2)" },
      { id: "D", text: "sqrt(2)" }
    ],
    correct: "C",
    explanation: "de Broglie wavelength λ = h / p = h / sqrt(2 * m * KE). When KE becomes 2 * KE, λ' = λ / sqrt(2).",
    ncertRef: "NCERT Class 12, Chapter 11: Dual Nature of Radiation and Matter, Section 11.8"
  },

  // NEET Chemistry: GOC & Hydrocarbons
  {
    id: "NEET-CHEM-GOC-2024-Q1",
    exam: "NEET-UG",
    subject: "Chemistry",
    chapterId: "goc-organic",
    year: 2024,
    difficulty: "Moderate",
    question: "Which of the following carbocations is the most stable due to hyperconjugation and resonance?",
    options: [
      { id: "A", text: "CH3-CH2+" },
      { id: "B", text: "(CH3)2CH+" },
      { id: "C", text: "(CH3)3C+" },
      { id: "D", text: "C6H5-CH2+ (Benzyl cation)" }
    ],
    correct: "D",
    explanation: "The benzyl carbocation (C6H5-CH2+) is stabilized by delocalization of the positive charge across the aromatic pi-electron cloud through four resonance contributors, providing greater stabilization energy than alkyl inductive/hyperconjugative effects.",
    ncertRef: "NCERT Class 11, Chapter 12: Organic Chemistry - Basic Principles and Techniques, Section 12.7"
  },

  // NEET Chemistry: Coordination Compounds
  {
    id: "NEET-CHEM-COORD-2024-Q1",
    exam: "NEET-UG",
    subject: "Chemistry",
    chapterId: "coordination-compounds",
    year: 2024,
    difficulty: "Moderate",
    question: "The IUPAC name of the complex [Co(NH3)5(CO3)]Cl is:",
    options: [
      { id: "A", text: "Pentaamminecarbonatocobalt(III) chloride" },
      { id: "B", text: "Carbonatopentaamminecobalt(III) chloride" },
      { id: "C", text: "Pentaamminecarbonatocobalt(II) chloride" },
      { id: "D", text: "Pentaamminecobalt(III) carbonate chloride" }
    ],
    correct: "A",
    explanation: "Ligands are named alphabetically: 'ammine' comes before 'carbonato'. Oxidation state of Co is +3: x + 5(0) + (-2) + (-1) = 0 => x = +3. Hence, Pentaamminecarbonatocobalt(III) chloride.",
    ncertRef: "NCERT Class 12, Chapter 9: Coordination Compounds, Section 9.3"
  },

  // NEET Chemistry: Electrochemistry & Kinetics
  {
    id: "NEET-CHEM-ELECTRO-2024-Q1",
    exam: "NEET-UG",
    subject: "Chemistry",
    chapterId: "electrochem-kinetics",
    year: 2024,
    difficulty: "Easy",
    question: "For a first order reaction, the time required to complete 99.9% of the reaction is approximately how many times the half-life (t_1/2)?",
    options: [
      { id: "A", text: "3 times" },
      { id: "B", text: "10 times" },
      { id: "C", text: "5 times" },
      { id: "D", text: "20 times" }
    ],
    correct: "B",
    explanation: "t_99.9% = (2.303/k) * log(100 / 0.1) = (2.303/k) * log(1000) = 3 * (2.303/k). Since t_1/2 = (2.303/k) * log(2) = (0.693/k), t_99.9% / t_1/2 = 3 * log(10) / log(2) = 3 / 0.3010 ≈ 10 times.",
    ncertRef: "NCERT Class 12, Chapter 4: Chemical Kinetics, Section 4.3"
  },

  // JEE Main: Electrostatics & Capacitance
  {
    id: "JEE-PHY-ELECTRO-2024-Q1",
    exam: "JEE-MAIN",
    subject: "Physics",
    chapterId: "electrostatics-capacitance",
    year: 2024,
    difficulty: "Moderate",
    question: "A parallel plate capacitor with plate area A and separation d is filled with two dielectric slabs of dielectric constants K1 and K2 of equal thickness d/2 in series. The effective capacitance is:",
    options: [
      { id: "A", text: "(ε0 * A / d) * (K1 + K2)" },
      { id: "B", text: "(2 * ε0 * A / d) * (K1 * K2 / (K1 + K2))" },
      { id: "C", text: "(ε0 * A / (2*d)) * (K1 * K2 / (K1 + K2))" },
      { id: "D", text: "(ε0 * A / d) * (K1 * K2)" }
    ],
    correct: "B",
    explanation: "Two slabs in series have capacitances C1 = K1*ε0*A / (d/2) = 2*K1*ε0*A/d and C2 = 2*K2*ε0*A/d. The equivalent series capacitance 1/C_eq = 1/C1 + 1/C2 = (d / (2*ε0*A)) * (1/K1 + 1/K2). Inverting gives C_eq = (2 * ε0 * A / d) * (K1 * K2 / (K1 + K2)).",
    ncertRef: "NCERT Class 12, Chapter 2: Electrostatic Potential and Capacitance, Section 2.14"
  },

  // JEE Main: Current Electricity & Magnetism
  {
    id: "JEE-PHY-MAG-2024-Q1",
    exam: "JEE-MAIN",
    subject: "Physics",
    chapterId: "current-magnetism",
    year: 2024,
    difficulty: "Moderate",
    question: "A charged particle q with velocity v enters a region of uniform magnetic field B perpendicular to its direction. The work done by the magnetic force on the charge along a complete circular orbit is:",
    options: [
      { id: "A", text: "q * v * B * 2πR" },
      { id: "B", text: "Zero" },
      { id: "C", text: "(1/2) * m * v^2" },
      { id: "D", text: "q * v * B" }
    ],
    correct: "B",
    explanation: "The magnetic Lorentz force is given by F = q * (v x B). Because the magnetic force is always perpendicular to instantaneous velocity vector v (and displacement dr), F · dr = 0. Therefore, the work done by a purely magnetic field is always zero.",
    ncertRef: "NCERT Class 12, Chapter 4: Moving Charges and Magnetism, Section 4.3"
  },

  // JEE Main: Thermodynamics & KTG
  {
    id: "JEE-PHY-THERMO-2024-Q1",
    exam: "JEE-MAIN",
    subject: "Physics",
    chapterId: "thermodynamics-ktg",
    year: 2024,
    difficulty: "Easy",
    question: "One mole of an ideal monoatomic gas (γ = 5/3) is compressed adiabatically to 1/8 of its original volume. If initial temperature is T, the final temperature will be:",
    options: [
      { id: "A", text: "2 T" },
      { id: "B", text: "4 T" },
      { id: "C", text: "8 T" },
      { id: "D", text: "16 T" }
    ],
    correct: "B",
    explanation: "For an adiabatic process: T1 * V1^(γ-1) = T2 * V2^(γ-1). T2 = T1 * (V1 / V2)^(5/3 - 1) = T * (8)^(2/3) = T * (2^3)^(2/3) = T * 4 = 4 T.",
    ncertRef: "NCERT Class 11, Chapter 12: Thermodynamics, Section 12.8"
  },

  // JEE Main: Chemical Bonding & Periodic Table
  {
    id: "JEE-CHEM-BOND-2024-Q1",
    exam: "JEE-MAIN",
    subject: "Chemistry",
    chapterId: "chemical-bonding-jee",
    year: 2024,
    difficulty: "Easy",
    question: "According to VSEPR theory, the molecular shape and the number of lone pairs on the central atom in XeF4 are respectively:",
    options: [
      { id: "A", text: "Tetrahedral, 0" },
      { id: "B", text: "Square planar, 2" },
      { id: "C", text: "See-saw, 1" },
      { id: "D", text: "Octahedral, 2" }
    ],
    correct: "B",
    explanation: "Xe has 8 valence electrons. With 4 bond pairs to F and 2 lone pairs, total steric number is 6 (sp3d2 hybridization). The two lone pairs occupy trans-axial positions to minimize repulsion, yielding a square planar geometry.",
    ncertRef: "NCERT Class 11, Chapter 4: Chemical Bonding and Molecular Structure, Section 4.2"
  },

  // JEE Main: Coordination Compounds
  {
    id: "JEE-CHEM-COORD-2024-Q1",
    exam: "JEE-MAIN",
    subject: "Chemistry",
    chapterId: "coordination-jee",
    year: 2024,
    difficulty: "Moderate",
    question: "The spin-only magnetic moment of [Fe(H2O)6]2+ (atomic number of Fe = 26) is approximately:",
    options: [
      { id: "A", text: "0 BM" },
      { id: "B", text: "2.84 BM" },
      { id: "C", text: "4.90 BM" },
      { id: "D", text: "5.92 BM" }
    ],
    correct: "C",
    explanation: "In [Fe(H2O)6]2+, Fe is in +2 oxidation state (3d6 configuration). Water (H2O) is a weak field ligand, so pairing does not occur: configuration is t2g^4 eg^2, leaving 4 unpaired electrons. Magnetic moment μ = sqrt(4 * (4 + 2)) = sqrt(24) ≈ 4.90 BM.",
    ncertRef: "NCERT Class 12, Chapter 9: Coordination Compounds, Section 9.5"
  },

  // JEE Main: Thermodynamics & Solutions
  {
    id: "JEE-CHEM-THERMO-2024-Q1",
    exam: "JEE-MAIN",
    subject: "Chemistry",
    chapterId: "thermo-solutions",
    year: 2024,
    difficulty: "Moderate",
    question: "The Van't Hoff factor (i) for a 0.1 M aqueous solution of K4[Fe(CN)6] that is 80% dissociated is:",
    options: [
      { id: "A", text: "4.2" },
      { id: "B", text: "5.0" },
      { id: "C", text: "3.8" },
      { id: "D", text: "4.0" }
    ],
    correct: "A",
    explanation: "K4[Fe(CN)6] -> 4 K+ + [Fe(CN)6]4- (total particles n = 5). For degree of dissociation α = 0.8: i = 1 + (n - 1) * α = 1 + (5 - 1) * 0.8 = 1 + 3.2 = 4.2.",
    ncertRef: "NCERT Class 12, Chapter 2: Solutions, Section 2.7"
  },

  // JEE Main: Coordinate Geometry & Conics
  {
    id: "JEE-MATH-CONICS-2024-Q1",
    exam: "JEE-MAIN",
    subject: "Mathematics",
    chapterId: "coordinate-conics",
    year: 2024,
    difficulty: "Moderate",
    question: "The equation of the tangent to the parabola y^2 = 8x which is parallel to the line 2x - y + 7 = 0 is:",
    options: [
      { id: "A", text: "y = 2x + 1" },
      { id: "B", text: "y = 2x - 1" },
      { id: "C", text: "y = 2x + 4" },
      { id: "D", text: "y = 2x + 2" }
    ],
    correct: "A",
    explanation: "For y^2 = 4ax, 4a = 8 => a = 2. Slope of the given line is m = 2. Tangent with slope m to parabola y^2 = 4ax is y = mx + a/m. Substituting m = 2 and a = 2 gives y = 2x + (2/2) => y = 2x + 1.",
    ncertRef: "NCERT Class 11, Chapter 11: Conic Sections, Section 11.2"
  }
];

// Deduplicate and merge
const existingIds = new Set(existingBank.map(q => q.id));
let added = 0;
for (const q of additionalQuestions) {
  if (!existingIds.has(q.id)) {
    existingBank.push(q);
    existingIds.add(q.id);
    added++;
  }
}

fs.writeFileSync(bankPath, JSON.stringify(existingBank, null, 2), 'utf8');
fs.writeFileSync(publicBankPath, JSON.stringify(existingBank, null, 2), 'utf8');
console.log(`Enrichment complete: added ${added} new questions. Total questions: ${existingBank.length}`);
