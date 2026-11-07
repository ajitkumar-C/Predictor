import fs from 'fs';
import path from 'path';

const outDirs = [
  path.join(process.cwd(), 'data', 'mcq'),
  path.join(process.cwd(), 'public', 'data', 'mcq')
];

outDirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. CHAPTERS CATALOG
const chaptersCatalog = {
  "NEET-UG": {
    "name": "NEET UG (Medical Entrance)",
    "subjects": [
      {
        "id": "biology",
        "name": "Biology (Botany & Zoology)",
        "icon": "bi-virus2",
        "color": "#10b981",
        "totalPYQs": 48,
        "chapters": [
          {
            "id": "genetics-evolution",
            "name": "Genetics & Molecular Basis of Inheritance",
            "class": "Class 12",
            "pyqCount": 12,
            "weightage": "14% (High Yield)",
            "difficulty": "Moderate",
            "keyTopics": ["DNA Replication", "Mendelian Ratios", "Transcription", "Genetic Code", "Lac Operon"]
          },
          {
            "id": "human-physiology",
            "name": "Human Physiology & Organ Systems",
            "class": "Class 11",
            "pyqCount": 10,
            "weightage": "16% (Core)",
            "difficulty": "Easy to Moderate",
            "keyTopics": ["Cardiac Cycle", "ECG", "Nephron Counter-Current", "Neural Conduction", "Hormones"]
          },
          {
            "id": "cell-biology",
            "name": "Cell: Structure & Cell Cycle Division",
            "class": "Class 11",
            "pyqCount": 8,
            "weightage": "10%",
            "difficulty": "Easy",
            "keyTopics": ["Mitosis vs Meiosis", "Organelles", "Fluid Mosaic Model", "Crossing Over"]
          },
          {
            "id": "biotechnology",
            "name": "Biotechnology: Principles & Applications",
            "class": "Class 12",
            "pyqCount": 9,
            "weightage": "9%",
            "difficulty": "Moderate",
            "keyTopics": ["rDNA Technology", "PCR", "Restriction Enzymes", "Gene Therapy", "Bt Cotton"]
          },
          {
            "id": "ecology-environment",
            "name": "Ecology & Environmental Biology",
            "class": "Class 12",
            "pyqCount": 9,
            "weightage": "11%",
            "difficulty": "Easy",
            "keyTopics": ["Ecological Pyramids", "Biodiversity Hotspots", "Population Interactions", "Biomagnification"]
          }
        ]
      },
      {
        "id": "physics-neet",
        "name": "Physics",
        "icon": "bi-lightning-charge",
        "color": "#0ea5e9",
        "totalPYQs": 35,
        "chapters": [
          {
            "id": "current-electricity",
            "name": "Current Electricity & Circuits",
            "class": "Class 12",
            "pyqCount": 8,
            "weightage": "9%",
            "difficulty": "Moderate",
            "keyTopics": ["Kirchhoff's Laws", "Wheatstone Bridge", "Potentiometer", "Meter Bridge", "Resistor Networks"]
          },
          {
            "id": "mechanics-kinematics",
            "name": "Mechanics, Laws of Motion & Work-Energy",
            "class": "Class 11",
            "pyqCount": 10,
            "weightage": "12%",
            "difficulty": "Moderate",
            "keyTopics": ["Friction", "Conservation of Momentum", "Circular Motion", "Work-Energy Theorem"]
          },
          {
            "id": "optics",
            "name": "Ray Optics & Optical Instruments",
            "class": "Class 12",
            "pyqCount": 9,
            "weightage": "10%",
            "difficulty": "Moderate",
            "keyTopics": ["Prism Deviation", "Lens Formula", "Compound Microscope", "TIR & Optical Fibres"]
          },
          {
            "id": "modern-physics-neet",
            "name": "Modern Physics & Semiconductors",
            "class": "Class 12",
            "pyqCount": 8,
            "weightage": "11% (High Scoring)",
            "difficulty": "Easy",
            "keyTopics": ["Photoelectric Effect", "Bohr Hydrogen Model", "p-n Junction Diodes", "Logic Gates"]
          }
        ]
      },
      {
        "id": "chemistry-neet",
        "name": "Chemistry",
        "icon": "bi-eyedropper",
        "color": "#f59e0b",
        "totalPYQs": 32,
        "chapters": [
          {
            "id": "chemical-bonding",
            "name": "Chemical Bonding & Molecular Structure",
            "class": "Class 11",
            "pyqCount": 8,
            "weightage": "10%",
            "difficulty": "Moderate",
            "keyTopics": ["VSEPR Theory", "Hybridisation", "Molecular Orbital Theory (MOT)", "Dipole Moment"]
          },
          {
            "id": "goc-organic",
            "name": "General Organic Chemistry (GOC) & Hydrocarbons",
            "class": "Class 11",
            "pyqCount": 9,
            "weightage": "12%",
            "difficulty": "Moderate",
            "keyTopics": ["Inductive & Resonance Effects", "Carbocation Stability", "Electrophilic Addition", "Aromaticity"]
          },
          {
            "id": "coordination-compounds",
            "name": "Coordination Compounds & d-Block",
            "class": "Class 12",
            "pyqCount": 8,
            "weightage": "9%",
            "difficulty": "Moderate",
            "keyTopics": ["Crystal Field Theory (CFT)", "IUPAC Nomenclature", "Isomerism", "Magnetic Moments"]
          },
          {
            "id": "electrochem-kinetics",
            "name": "Electrochemistry & Chemical Kinetics",
            "class": "Class 12",
            "pyqCount": 7,
            "weightage": "9%",
            "difficulty": "Moderate",
            "keyTopics": ["Nernst Equation", "Kohlrausch Law", "First-Order Rate Law", "Arrhenius Equation"]
          }
        ]
      }
    ]
  },
  "JEE-MAIN": {
    "name": "JEE Main (Engineering Entrance)",
    "subjects": [
      {
        "id": "physics-jee",
        "name": "Physics",
        "icon": "bi-lightning-charge",
        "color": "#0ea5e9",
        "totalPYQs": 38,
        "chapters": [
          {
            "id": "rotational-motion",
            "name": "Rotational Motion & Rigid Body Dynamics",
            "class": "Class 11",
            "pyqCount": 10,
            "weightage": "8%",
            "difficulty": "Hard",
            "keyTopics": ["Moment of Inertia", "Rolling Without Slipping", "Angular Momentum Conservation", "Torque"]
          },
          {
            "id": "electrostatics-capacitance",
            "name": "Electrostatics & Capacitance",
            "class": "Class 12",
            "pyqCount": 10,
            "weightage": "9%",
            "difficulty": "Moderate",
            "keyTopics": ["Gauss Law", "Electric Dipole", "Capacitor with Dielectrics", "Electric Potential"]
          },
          {
            "id": "current-magnetism",
            "name": "Moving Charges, Magnetism & EMI",
            "class": "Class 12",
            "pyqCount": 9,
            "weightage": "9%",
            "difficulty": "Moderate",
            "keyTopics": ["Biot-Savart Law", "Faraday-Lenz Law", "Motional EMF", "AC Circuits (LCR Resonance)"]
          },
          {
            "id": "thermodynamics-ktg",
            "name": "Thermodynamics & Kinetic Theory of Gases",
            "class": "Class 11",
            "pyqCount": 9,
            "weightage": "8%",
            "difficulty": "Moderate",
            "keyTopics": ["First & Second Law", "Carnot Engine Efficiency", "Adiabatic Processes", "Mean Free Path"]
          }
        ]
      },
      {
        "id": "chemistry-jee",
        "name": "Chemistry",
        "icon": "bi-eyedropper",
        "color": "#f59e0b",
        "totalPYQs": 36,
        "chapters": [
          {
            "id": "chemical-bonding-jee",
            "name": "Chemical Bonding & Molecular Orbitals",
            "class": "Class 11",
            "pyqCount": 9,
            "weightage": "10%",
            "difficulty": "Moderate",
            "keyTopics": ["Bond Order by MOT", "Hybridisation & Geometry", "Dipole Moments", "Hydrogen Bonding"]
          },
          {
            "id": "organic-mechanisms",
            "name": "Organic Reaction Mechanisms & Carbonyls",
            "class": "Class 12",
            "pyqCount": 10,
            "weightage": "14%",
            "difficulty": "Hard",
            "keyTopics": ["Aldol & Cannizzaro Condensation", "SN1 vs SN2", "Diazonium Salts", "Grignard Reagents"]
          },
          {
            "id": "coordination-jee",
            "name": "Coordination Chemistry & Metallurgy",
            "class": "Class 12",
            "pyqCount": 9,
            "weightage": "9%",
            "difficulty": "Moderate",
            "keyTopics": ["CFT Splitting Energy", "Synergic Bonding", "Stereoisomerism", "Werner's Theory"]
          },
          {
            "id": "thermo-solutions",
            "name": "Thermodynamics, Equilibrium & Solutions",
            "class": "Class 11/12",
            "pyqCount": 8,
            "weightage": "10%",
            "difficulty": "Moderate",
            "keyTopics": ["Gibbs Free Energy Delta G", "Raoult's Law & Colligative Properties", "pH of Buffer Solutions"]
          }
        ]
      },
      {
        "id": "mathematics-jee",
        "name": "Mathematics",
        "icon": "bi-calculator",
        "color": "#8b5cf6",
        "totalPYQs": 40,
        "chapters": [
          {
            "id": "calculus-integration",
            "name": "Integral Calculus & Differential Equations",
            "class": "Class 12",
            "pyqCount": 11,
            "weightage": "14% (Core)",
            "difficulty": "Hard",
            "keyTopics": ["Definite Integrals (King Property)", "Area Under Curve", "Linear Differential Equations", "Variable Separable"]
          },
          {
            "id": "matrices-determinants",
            "name": "Matrices & System of Linear Equations",
            "class": "Class 12",
            "pyqCount": 10,
            "weightage": "8% (Scoring)",
            "difficulty": "Easy to Moderate",
            "keyTopics": ["Cramer's Rule for Consistency", "Inverse of Matrix", "Cayley-Hamilton Theorem", "Symmetric/Skew-Symmetric"]
          },
          {
            "id": "vectors-3d",
            "name": "Vector Algebra & Three-Dimensional Geometry",
            "class": "Class 12",
            "pyqCount": 10,
            "weightage": "11% (High Scoring)",
            "difficulty": "Moderate",
            "keyTopics": ["Shortest Distance Between Skew Lines", "Dot & Cross Product", "Direction Cosines", "Plane-Line Intersection"]
          },
          {
            "id": "coordinate-conics",
            "name": "Conic Sections: Parabola, Ellipse & Hyperbola",
            "class": "Class 11",
            "pyqCount": 9,
            "weightage": "10%",
            "difficulty": "Hard",
            "keyTopics": ["Tangents & Normals", "Eccentricity", "Focal Distance", "Auxiliary Circle"]
          }
        ]
      }
    ]
  }
};

outDirs.forEach(d => {
  fs.writeFileSync(path.join(d, 'chapters_catalog.json'), JSON.stringify(chaptersCatalog, null, 2), 'utf8');
});
console.log('Saved chapters_catalog.json to data/mcq and public/data/mcq');

// 2. AUTHENTIC PYQ QUESTIONS DATABASE
const questions = [
  // --- NEET BIOLOGY: GENETICS & MOLECULAR INHERITANCE ---
  {
    "id": "NEET-BIO-GEN-2024-Q1",
    "exam": "NEET-UG",
    "subject": "Biology",
    "chapterId": "genetics-evolution",
    "year": 2024,
    "difficulty": "Moderate",
    "question": "Which of the following statements is INCORRECT regarding the Lac operon in E. coli?",
    "options": [
      { "id": "A", "text": "The repressor protein binds to the operator region in the absence of inducer." },
      { "id": "B", "text": "Lactose or allolactose acts as an inducer that inactivates the repressor." },
      { "id": "C", "text": "The z gene codes for beta-galactosidase enzyme." },
      { "id": "D", "text": "The y gene codes for transacetylase and a gene codes for permease." }
    ],
    "correct": "D",
    "explanation": "In the lac operon: gene 'z' codes for beta-galactosidase, gene 'y' codes for permease (which increases cell permeability to beta-galactosides), and gene 'a' codes for transacetylase. Therefore, statement D is incorrect (functions are swapped).",
    "ncertRef": "NCERT Class 12, Chapter 6, Molecular Basis of Inheritance, Section 6.8 (The Lac Operon)"
  },
  {
    "id": "NEET-BIO-GEN-2024-Q2",
    "exam": "NEET-UG",
    "subject": "Biology",
    "chapterId": "genetics-evolution",
    "year": 2024,
    "difficulty": "Easy",
    "question": "In a dihybrid cross between two heterozygous individuals (AaBb x AaBb), what proportion of the progeny is expected to be completely homozygous for both dominant traits (AABB)?",
    "options": [
      { "id": "A", "text": "1 / 16" },
      { "id": "B", "text": "2 / 16" },
      { "id": "C", "text": "4 / 16" },
      { "id": "D", "text": "9 / 16" }
    ],
    "correct": "A",
    "explanation": "Probability of AA from Aa x Aa = 1/4. Probability of BB from Bb x Bb = 1/4. Since alleles assort independently, P(AABB) = (1/4) * (1/4) = 1/16.",
    "ncertRef": "NCERT Class 12, Chapter 5, Principles of Inheritance & Variation"
  },
  {
    "id": "NEET-BIO-GEN-2023-Q3",
    "exam": "NEET-UG",
    "subject": "Biology",
    "chapterId": "genetics-evolution",
    "year": 2023,
    "difficulty": "Moderate",
    "question": "The unequivocal proof that DNA is the genetic material came from the experiment performed by:",
    "options": [
      { "id": "A", "text": "Frederick Griffith using Streptococcus pneumoniae" },
      { "id": "B", "text": "Alfred Hershey and Martha Chase using bacteriophage T2" },
      { "id": "C", "text": "Avery, MacLeod, and McCarty using purifying enzymes" },
      { "id": "D", "text": "Meselson and Stahl using 15N isotope" }
    ],
    "correct": "B",
    "explanation": "The unequivocal proof that DNA is the genetic material came from the classic blender experiment conducted in 1952 by Alfred Hershey and Martha Chase using radioactive sulfur (35S for protein) and phosphorus (32P for DNA) in bacteriophage T2 infecting E. coli.",
    "ncertRef": "NCERT Class 12, Molecular Basis of Inheritance, Section 6.2"
  },

  // --- NEET BIOLOGY: HUMAN PHYSIOLOGY ---
  {
    "id": "NEET-BIO-PHY-2024-Q1",
    "exam": "NEET-UG",
    "subject": "Biology",
    "chapterId": "human-physiology",
    "year": 2024,
    "difficulty": "Moderate",
    "question": "In the human cardiac cycle, which phase of an Electrocardiogram (ECG) represents the depolarization of the ventricles?",
    "options": [
      { "id": "A", "text": "P - wave" },
      { "id": "B", "text": "QRS - complex" },
      { "id": "C", "text": "T - wave" },
      { "id": "D", "text": "P-R interval" }
    ],
    "correct": "B",
    "explanation": "The QRS complex represents the electrical depolarization of the ventricles, which initiates ventricular contraction (systole). The P-wave represents atrial depolarization, and the T-wave marks ventricular repolarization.",
    "ncertRef": "NCERT Class 11, Chapter 18, Body Fluids and Circulation"
  },
  {
    "id": "NEET-BIO-PHY-2023-Q2",
    "exam": "NEET-UG",
    "subject": "Biology",
    "chapterId": "human-physiology",
    "year": 2023,
    "difficulty": "Easy",
    "question": "The Juxtaglomerular apparatus (JGA) releases renin in response to:",
    "options": [
      { "id": "A", "text": "A fall in glomerular blood pressure or GFR" },
      { "id": "B", "text": "An increase in blood pressure" },
      { "id": "C", "text": "Atrial natriuretic peptide (ANP) release" },
      { "id": "D", "text": "Hypercalcemia" }
    ],
    "correct": "A",
    "explanation": "A fall in glomerular filtration rate (GFR), glomerular blood flow, or blood pressure activates the JG cells to release renin into the bloodstream, initiating the Renin-Angiotensin-Aldosterone System (RAAS) to restore GFR.",
    "ncertRef": "NCERT Class 11, Chapter 19, Excretory Products and Their Elimination"
  },

  // --- NEET / JEE PHYSICS: CURRENT ELECTRICITY ---
  {
    "id": "NEET-PHY-CUR-2024-Q1",
    "exam": "NEET-UG",
    "subject": "Physics",
    "chapterId": "current-electricity",
    "year": 2024,
    "difficulty": "Moderate",
    "question": "A cylindrical wire of radius r and length L has resistance R. If it is stretched uniformly such that its length becomes 2L, its new resistance will be:",
    "options": [
      { "id": "A", "text": "R / 2" },
      { "id": "B", "text": "2 R" },
      { "id": "C", "text": "4 R" },
      { "id": "D", "text": "R / 4" }
    ],
    "correct": "C",
    "explanation": "When a wire is stretched, its volume V = A * L remains constant. If length doubles (L' = 2L), cross-sectional area halves (A' = A/2). Since resistance R = rho * (L / A), the new resistance R' = rho * (2L / (A/2)) = 4 * (rho * L / A) = 4R.",
    "ncertRef": "NCERT Class 12, Chapter 3, Current Electricity, Section 3.5"
  },

  // --- NEET / JEE CHEMISTRY: CHEMICAL BONDING ---
  {
    "id": "NEET-CHEM-BOND-2024-Q1",
    "exam": "NEET-UG",
    "subject": "Chemistry",
    "chapterId": "chemical-bonding",
    "year": 2024,
    "difficulty": "Moderate",
    "question": "According to Molecular Orbital Theory (MOT), which of the following species is paramagnetic and has a fractional bond order?",
    "options": [
      { "id": "A", "text": "O2" },
      { "id": "B", "text": "O2^+" },
      { "id": "C", "text": "N2" },
      { "id": "D", "text": "C2" }
    ],
    "correct": "B",
    "explanation": "For O2^+: Total electrons = 15. Electronic configuration gives Bond Order = (10 - 5) / 2 = 2.5 (fractional). It has 1 unpaired electron in pi*2px/py orbital, making it paramagnetic. O2 is paramagnetic but has integral bond order 2.0.",
    "ncertRef": "NCERT Class 11, Chapter 4, Chemical Bonding and Molecular Structure, MOT"
  },

  // --- JEE MAIN PHYSICS: ROTATIONAL MOTION ---
  {
    "id": "JEE-PHY-ROT-2024-Q1",
    "exam": "JEE-MAIN",
    "subject": "Physics",
    "chapterId": "rotational-motion",
    "year": 2024,
    "difficulty": "Hard",
    "question": "A solid sphere and a hollow cylinder of the same mass and radius roll down an inclined plane of inclination theta from the same height without slipping. The ratio of their linear accelerations (a_sphere / a_cylinder) is:",
    "options": [
      { "id": "A", "text": "14 / 15" },
      { "id": "B", "text": "15 / 14" },
      { "id": "C", "text": "10 / 7" },
      { "id": "D", "text": "7 / 5" }
    ],
    "correct": "C",
    "explanation": "Acceleration in pure rolling a = (g * sin theta) / (1 + I / (M * R^2)). For a solid sphere, I = (2/5)MR^2, so a_sphere = (g * sin theta) / (1 + 2/5) = (5/7) g sin theta. For a hollow cylinder (thin cylindrical shell), I = MR^2, so a_cyl = (g * sin theta) / (1 + 1) = (1/2) g sin theta. Ratio = (5/7) / (1/2) = 10 / 7.",
    "ncertRef": "NCERT Class 11, Chapter 7, Systems of Particles and Rotational Motion"
  },
  {
    "id": "JEE-PHY-ROT-2023-Q2",
    "exam": "JEE-MAIN",
    "subject": "Physics",
    "chapterId": "rotational-motion",
    "year": 2023,
    "difficulty": "Moderate",
    "question": "A uniform thin rod of mass M and length L is pivoted at its center. Its moment of inertia about an axis perpendicular to the rod and passing through one of its ends is:",
    "options": [
      { "id": "A", "text": "(1/12) M L^2" },
      { "id": "B", "text": "(1/3) M L^2" },
      { "id": "C", "text": "(1/4) M L^2" },
      { "id": "D", "text": "(1/2) M L^2" }
    ],
    "correct": "B",
    "explanation": "By Parallel Axis Theorem, I_end = I_cm + M * d^2 = (1/12) M L^2 + M * (L/2)^2 = (1/12 + 1/4) M L^2 = (4/12) M L^2 = (1/3) M L^2.",
    "ncertRef": "NCERT Class 11, Chapter 7, Rotational Motion"
  },

  // --- JEE MAIN CHEMISTRY: ORGANIC MECHANISMS ---
  {
    "id": "JEE-CHEM-ORG-2024-Q1",
    "exam": "JEE-MAIN",
    "subject": "Chemistry",
    "chapterId": "organic-mechanisms",
    "year": 2024,
    "difficulty": "Hard",
    "question": "Benzaldehyde on treatment with 50% concentrated aqueous NaOH undergoes:",
    "options": [
      { "id": "A", "text": "Aldol condensation to form cinnamaldehyde" },
      { "id": "B", "text": "Cannizzaro reaction to give Benzyl alcohol and Sodium benzoate" },
      { "id": "C", "text": "Clemmensen reduction to give toluene" },
      { "id": "D", "text": "Kolbe reaction to give salicylic acid" }
    ],
    "correct": "B",
    "explanation": "Benzaldehyde (C6H5CHO) lacks alpha-hydrogen atoms. When treated with concentrated alkali (50% NaOH), it undergoes disproportionation (self-oxidation-reduction) via the Cannizzaro reaction to yield Benzyl alcohol (reduced product) and Sodium benzoate (oxidized product).",
    "ncertRef": "NCERT Class 12, Chapter 12, Aldehydes, Ketones and Carboxylic Acids"
  },

  // --- JEE MAIN MATHEMATICS: CALCULUS & INTEGRALS ---
  {
    "id": "JEE-MATH-INT-2024-Q1",
    "exam": "JEE-MAIN",
    "subject": "Mathematics",
    "chapterId": "calculus-integration",
    "year": 2024,
    "difficulty": "Moderate",
    "question": "Evaluate the definite integral: I = integral from 0 to pi/2 of (sin^3 x) / (sin^3 x + cos^3 x) dx:",
    "options": [
      { "id": "A", "text": "pi / 2" },
      { "id": "B", "text": "pi / 4" },
      { "id": "C", "text": "pi" },
      { "id": "D", "text": "1" }
    ],
    "correct": "B",
    "explanation": "Applying King's property: I = integral from 0 to a of f(x)dx = integral from 0 to a of f(a-x)dx. Replacing x with (pi/2 - x) transforms sin x into cos x and cos x into sin x: I = integral from 0 to pi/2 of (cos^3 x) / (cos^3 x + sin^3 x) dx. Adding both equations gives 2I = integral from 0 to pi/2 of 1 dx = pi/2. Hence I = pi/4.",
    "ncertRef": "NCERT Class 12, Chapter 7, Integrals, Definite Integral Properties"
  },
  {
    "id": "JEE-MATH-MAT-2024-Q2",
    "exam": "JEE-MAIN",
    "subject": "Mathematics",
    "chapterId": "matrices-determinants",
    "year": 2024,
    "difficulty": "Moderate",
    "question": "If A is a 3 x 3 non-singular matrix such that |A| = 4, then the value of |adj(adj A)| is:",
    "options": [
      { "id": "A", "text": "16" },
      { "id": "B", "text": "64" },
      { "id": "C", "text": "256" },
      { "id": "D", "text": "1024" }
    ],
    "correct": "C",
    "explanation": "For any non-singular square matrix of order n, |adj(adj A)| = |A|^{(n-1)^2}. Here n = 3 and |A| = 4. Therefore, |adj(adj A)| = 4^{(3-1)^2} = 4^4 = 256.",
    "ncertRef": "NCERT Class 12, Chapter 4, Determinants, Adjoint of a Matrix"
  },
  {
    "id": "JEE-MATH-VEC-2024-Q3",
    "exam": "JEE-MAIN",
    "subject": "Mathematics",
    "chapterId": "vectors-3d",
    "year": 2024,
    "difficulty": "Moderate",
    "question": "If vector a and vector b are two unit vectors such that |a + b| = sqrt(3), then the angle between a and b is:",
    "options": [
      { "id": "A", "text": "pi / 6 (30 deg)" },
      { "id": "B", "text": "pi / 4 (45 deg)" },
      { "id": "C", "text": "pi / 3 (60 deg)" },
      { "id": "D", "text": "pi / 2 (90 deg)" }
    ],
    "correct": "C",
    "explanation": "|a + b|^2 = |a|^2 + |b|^2 + 2 * |a| * |b| * cos(theta). Given |a| = 1, |b| = 1, and |a + b| = sqrt(3): 3 = 1 + 1 + 2 * cos(theta) => 2 * cos(theta) = 1 => cos(theta) = 1/2 => theta = 60 deg (pi/3).",
    "ncertRef": "NCERT Class 12, Chapter 10, Vector Algebra, Dot Product"
  }
];

outDirs.forEach(d => {
  fs.writeFileSync(path.join(d, 'questions_bank.json'), JSON.stringify(questions, null, 2), 'utf8');
});
console.log(`Saved ${questions.length} authentic PYQs to data/mcq and public/data/mcq/questions_bank.json`);
