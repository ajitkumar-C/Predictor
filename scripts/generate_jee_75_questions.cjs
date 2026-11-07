/**
 * generate_jee_75_questions.cjs
 * Generates official-pattern 75 Questions for JEE Main 2024 Full CBT Mock Paper (JEE-2024-JAN-S1)
 * 25 Physics + 25 Chemistry + 25 Mathematics
 */

const fs = require('fs');
const path = require('path');

const physicsQuestions = [
  {
    q: "A particle of mass m moves in a circular orbit of radius r under the action of a central attractive force F = -k / r^3. The total mechanical energy of the particle (with potential energy V(infinity) = 0) is:",
    opts: ["-k / (2 * r^2)", "-k / (4 * r^2)", "0", "+k / (2 * r^2)"],
    ans: "C",
    sol: "Force F = -k / r^3. For circular orbit, m*v^2 / r = k / r^3 => m*v^2 = k / r^2. Kinetic energy K = (1/2) m*v^2 = k / (2*r^2). Potential energy U(r) = - integral(F dr from inf to r) = - integral(-k/r^3 dr) = -k / (2*r^2). Total mechanical energy E = K + U = k / (2*r^2) - k / (2*r^2) = 0.",
    ref: "NCERT Class 11, Work, Energy & Power & Gravitation"
  },
  {
    q: "A solid sphere and a hollow cylinder of the same mass and radius roll down an inclined plane of inclination theta from the same height without slipping. The ratio of their linear accelerations (a_sphere / a_cylinder) is:",
    opts: ["14 / 15", "15 / 14", "10 / 7", "7 / 5"],
    ans: "C",
    sol: "Acceleration in pure rolling is a = (g sin theta) / (1 + I / (M R^2)). For solid sphere: I = 2/5 M R^2 => a_sphere = (5/7) g sin theta. For thin hollow cylinder: I = M R^2 => a_cyl = (1/2) g sin theta. Ratio = (5/7) / (1/2) = 10 / 7.",
    ref: "NCERT Class 11, Systems of Particles & Rotational Motion"
  },
  {
    q: "A Carnot engine has an efficiency of 25% when the sink temperature is 27 deg C. If the temperature of the source is increased by 50 K, its new efficiency will be approximately:",
    opts: ["33.3%", "37.5%", "28.6%", "30.0%"],
    ans: "C",
    sol: "Sink temp T2 = 27 + 273 = 300 K. Efficiency eta = 1 - T2/T1 = 0.25 => T2/T1 = 0.75 => T1 = 300 / 0.75 = 400 K. New source temp T1' = 400 + 50 = 450 K. New efficiency eta' = 1 - 300/450 = 1 - 2/3 = 1/3 = 33.3% or 150/450 = 33.3%.",
    ref: "NCERT Class 11, Thermodynamics"
  },
  {
    q: "An electromagnetic wave is propagating along the +z direction. If the electric field is along the +x axis at a given instant, the direction of the magnetic field vector B is along:",
    opts: ["+y axis", "-y axis", "+z axis", "-x axis"],
    ans: "A",
    sol: "The Poynting vector direction S = E x B points in the direction of propagation (+z). Here E is in +i (x-axis), so (+i) x (+j) = +k (+z). Hence B points along the +y axis.",
    ref: "NCERT Class 12, Electromagnetic Waves"
  },
  {
    q: "Two identical thin plano-convex lenses of focal length f and refractive index 1.5 are placed in contact with their curved surfaces facing each other. The space between them is filled with water (refractive index 4/3). The focal length of the combination is:",
    opts: ["f / 2", "3f / 4", "4f / 3", "2f"],
    ans: "B",
    sol: "Power of combination P = P1 + P_liquid + P2. Each lens has P_lens = 1/f = (1.5 - 1)(1/R) = 0.5/R => R = 0.5 f. Liquid lens is biconcave with R1 = -R and R2 = +R. P_liquid = (4/3 - 1)(-1/R - 1/R) = (1/3)(-2/R) = -2 / (3 * 0.5 f) = -4 / (3f). Total power P = 1/f + 1/f - 4/(3f) = 2/f - 4/(3f) = 2/(3f) or 4/(3f). Effective focal length F = 3f / 4.",
    ref: "NCERT Class 12, Ray Optics"
  },
  {
    q: "A parallel plate capacitor with plate area A and separation d is filled with two dielectric slabs of dielectric constants K1 and K2, each of thickness d/2. The equivalent capacitance is:",
    opts: ["2 epsilon_0 A / d * (K1 * K2 / (K1 + K2))", "epsilon_0 A / (2d) * (K1 + K2)", "epsilon_0 A / d * (K1 + K2)", "4 epsilon_0 A / d * (K1 * K2 / (K1 + K2))"],
    ans: "A",
    sol: "The two dielectric slabs in series have capacitances C1 = K1 * epsilon_0 * A / (d/2) = 2 K1 epsilon_0 A / d and C2 = 2 K2 epsilon_0 A / d. In series: 1/C_eq = 1/C1 + 1/C2 = d / (2 epsilon_0 A) * (1/K1 + 1/K2) => C_eq = 2 epsilon_0 A / d * (K1*K2 / (K1+K2)).",
    ref: "NCERT Class 12, Electrostatic Potential & Capacitance"
  },
  {
    q: "In Young's double slit experiment, monochromatic light of wavelength 600 nm illuminates slits separated by 0.2 mm. The fringe width observed on a screen 1.5 m away is:",
    opts: ["4.5 mm", "3.0 mm", "2.25 mm", "1.5 mm"],
    ans: "A",
    sol: "Fringe width beta = lambda * D / d = (600 * 10^-9 m * 1.5 m) / (0.2 * 10^-3 m) = 900 * 10^-9 / 2 * 10^-4 = 4.5 * 10^-3 m = 4.5 mm.",
    ref: "NCERT Class 12, Wave Optics"
  },
  {
    q: "A wire of resistance R is stretched uniformly such that its length increases by 0.5%. The percentage change in its electrical resistance is approximately:",
    opts: ["+0.5%", "+1.0%", "+0.25%", "+2.0%"],
    ans: "B",
    sol: "Resistance R = rho * L / A. Volume V = A * L = constant, so A = V / L. Thus R = rho * L^2 / V. For small changes, Delta R / R = 2 * (Delta L / L) = 2 * (0.5%) = +1.0%.",
    ref: "NCERT Class 12, Current Electricity"
  },
  {
    q: "A radioactive sample has a half-life of 20 minutes. The fraction of the original active nuclei remaining after 80 minutes is:",
    opts: ["1 / 4", "1 / 8", "1 / 16", "1 / 32"],
    ans: "C",
    sol: "Number of half-lives n = t / T_half = 80 min / 20 min = 4. Fraction remaining N / N0 = (1/2)^n = (1/2)^4 = 1/16.",
    ref: "NCERT Class 12, Nuclei"
  },
  {
    q: "The de Broglie wavelength of an electron accelerated through a potential difference of 100 V is approximately:",
    opts: ["0.123 nm", "1.227 nm", "0.012 nm", "12.27 nm"],
    ans: "A",
    sol: "For an electron, lambda = 1.227 / sqrt(V) nm. For V = 100 V, lambda = 1.227 / 10 nm = 0.1227 nm = 0.123 nm.",
    ref: "NCERT Class 12, Dual Nature of Radiation & Matter"
  },
  {
    q: "A block of mass 2 kg rests on a rough horizontal surface with coefficient of static friction mu_s = 0.4. A horizontal force of 6 N is applied. The frictional force acting on the block is (g = 10 m/s^2):",
    opts: ["8 N", "6 N", "4 N", "0 N"],
    ans: "B",
    sol: "Limiting static friction f_max = mu_s * m * g = 0.4 * 2 * 10 = 8 N. Applied force F = 6 N is less than f_max. Therefore, the block does not move, and self-adjusting static friction f = applied force = 6 N.",
    ref: "NCERT Class 11, Laws of Motion"
  },
  {
    q: "An LC circuit contains a 20 mH inductor and a 50 microfarad capacitor with an initial charge of 10 mC. The angular frequency of natural oscillations of the circuit is:",
    opts: ["1000 rad/s", "500 rad/s", "200 rad/s", "100 rad/s"],
    ans: "A",
    sol: "Angular frequency omega = 1 / sqrt(L * C) = 1 / sqrt(20 * 10^-3 * 50 * 10^-6) = 1 / sqrt(1000 * 10^-9) = 1 / sqrt(10^-6) = 1000 rad/s.",
    ref: "NCERT Class 12, Alternating Current"
  },
  {
    q: "The escape velocity of a body from the surface of Earth is 11.2 km/s. If a body is projected at twice the escape velocity, its speed in interstellar space (far from Earth) will be:",
    opts: ["11.2 km/s", "19.4 km/s", "22.4 km/s", "15.8 km/s"],
    ans: "B",
    sol: "By conservation of mechanical energy: (1/2) m v^2 - G M m / R = (1/2) m v_inf^2. Since G M m / R = (1/2) m v_e^2, we get v_inf^2 = v^2 - v_e^2 = (2 v_e)^2 - v_e^2 = 3 v_e^2. Therefore v_inf = sqrt(3) * v_e = 1.732 * 11.2 km/s = 19.4 km/s.",
    ref: "NCERT Class 11, Gravitation"
  },
  {
    q: "In an adiabatic expansion of an ideal monoatomic gas, its volume increases from V to 8V. The ratio of final pressure to initial pressure (P_f / P_i) is:",
    opts: ["1 / 16", "1 / 32", "1 / 8", "1 / 64"],
    ans: "B",
    sol: "For monoatomic gas, gamma = 5/3. Adiabatic relation: P * V^gamma = constant => P_f / P_i = (V_i / V_f)^gamma = (1/8)^(5/3) = ((1/2)^3)^(5/3) = (1/2)^5 = 1/32.",
    ref: "NCERT Class 11, Kinetic Theory & Thermodynamics"
  },
  {
    q: "A proton and an alpha particle enter a uniform magnetic field with the same kinetic energy perpendicular to the field. The ratio of the radii of their circular paths (r_p / r_alpha) is:",
    opts: ["1 : 1", "1 : 2", "2 : 1", "1 : 4"],
    ans: "A",
    sol: "Radius of charged particle in magnetic field r = p / (q B) = sqrt(2 m K) / (q B). For proton: m_p = m, q_p = e. For alpha particle: m_alpha = 4m, q_alpha = 2e. r_p / r_alpha = [sqrt(m) / e] / [sqrt(4m) / 2e] = [sqrt(m) / e] / [2 sqrt(m) / 2e] = 1 : 1.",
    ref: "NCERT Class 12, Moving Charges & Magnetism"
  },
  {
    q: "The velocity of a particle executing simple harmonic motion at displacement x from mean position is v^2 = 144 - 16 x^2. The time period of oscillation is:",
    opts: ["pi / 2 s", "pi / 4 s", "pi s", "2 pi s"],
    ans: "A",
    sol: "SHM equation v^2 = omega^2 (A^2 - x^2) = 16 (9 - x^2). Comparing gives omega^2 = 16 => omega = 4 rad/s. Time period T = 2 pi / omega = 2 pi / 4 = pi / 2 seconds.",
    ref: "NCERT Class 11, Oscillations"
  },
  {
    q: "A uniform magnetic field B = 0.5 T is perpendicular to a circular loop of wire of radius 10 cm and resistance 2 ohms. If the magnetic field collapses to zero in 0.1 s at a constant rate, the charge flown through the circuit is:",
    opts: ["0.0078 C", "0.0157 C", "0.0314 C", "0.0628 C"],
    ans: "A",
    sol: "Total charge flown Delta Q = Delta Phi / R. Magnetic flux Phi_initial = B * A = 0.5 * pi * (0.1)^2 = 0.5 * 3.1416 * 0.01 = 0.0157 Wb. Charge Q = 0.0157 / 2 = 0.00785 C.",
    ref: "NCERT Class 12, Electromagnetic Induction"
  },
  {
    q: "In a common emitter transistor amplifier, current gain beta = 100. If the base current changes by 20 microamperes, the corresponding change in collector current is:",
    opts: ["2 mA", "20 mA", "0.2 mA", "200 mA"],
    ans: "A",
    sol: "Beta = Delta I_c / Delta I_b => Delta I_c = beta * Delta I_b = 100 * (20 * 10^-6 A) = 2000 * 10^-6 A = 2 * 10^-3 A = 2 mA.",
    ref: "NCERT Class 12, Semiconductor Electronics"
  },
  {
    q: "The dimensions of Stefan-Boltzmann constant sigma in terms of M, L, T, and K (temperature) are:",
    opts: ["M L^0 T^-3 K^-4", "M L^1 T^-3 K^-4", "M L^2 T^-3 K^-4", "M L^0 T^-2 K^-4"],
    ans: "A",
    sol: "Energy radiated per unit area per unit time E = sigma * T^4 => sigma = E / T^4 = (Energy / (Area * Time)) / T^4 = (M L^2 T^-2 / (L^2 * T)) * K^-4 = M L^0 T^-3 K^-4.",
    ref: "NCERT Class 11, Units and Measurements"
  },
  {
    q: "A ray of light is incident at Brewster's angle on a transparent glass slab of refractive index 1.732. The angle of refraction inside the slab is:",
    opts: ["30 degrees", "45 degrees", "60 degrees", "90 degrees"],
    ans: "A",
    sol: "Brewster's law: tan(i_p) = mu = sqrt(3) = 1.732 => i_p = 60 degrees. Since reflected and refracted rays are perpendicular: i_p + r = 90 deg => r = 90 - 60 = 30 degrees.",
    ref: "NCERT Class 12, Wave Optics"
  },
  {
    q: "A capillary tube of radius r is dipped in water and water rises to height h. If the mass of water rising in the tube is M, the mass of water that will rise in a capillary tube of radius 2r is:",
    opts: ["2M", "4M", "M", "M / 2"],
    ans: "A",
    sol: "Height h = (2 T cos theta) / (r rho g). Mass M = pi * r^2 * h * rho = pi * r^2 * [(2 T cos theta) / (r rho g)] * rho = (2 pi T cos theta / g) * r. Thus mass M is directly proportional to radius r. For radius 2r, new mass is 2M.",
    ref: "NCERT Class 11, Mechanical Properties of Fluids"
  },
  {
    q: "A convex mirror of focal length 20 cm forms an image which is 1/4th the size of the object. The distance of the object from the mirror is:",
    opts: ["-60 cm", "-40 cm", "-80 cm", "-20 cm"],
    ans: "A",
    sol: "For convex mirror, magnification m = +1/4 and f = +20 cm. Magnification m = f / (f - u) => 1/4 = 20 / (20 - u) => 20 - u = 80 => u = 20 - 80 = -60 cm.",
    ref: "NCERT Class 12, Ray Optics"
  },
  {
    q: "Two identical tuning forks A and B produce 4 beats per second. When fork A is loaded with a little wax, the beat frequency increases to 6 beats per second. If the original frequency of B is 256 Hz, the frequency of A was:",
    opts: ["252 Hz", "260 Hz", "256 Hz", "250 Hz"],
    ans: "A",
    sol: "Initially |f_A - 256| = 4 => f_A could be 260 Hz or 252 Hz. When A is loaded with wax, its frequency f_A decreases. If f_A was 260 Hz, decreasing it would bring it closer to 256 (beats decrease). If f_A was 252 Hz, decreasing it widens the gap from 256, so beats increase from 4 to 6. Hence original f_A = 252 Hz.",
    ref: "NCERT Class 11, Waves"
  },
  {
    q: "In a series RLC circuit, R = 10 ohms, X_L = 20 ohms, and X_C = 20 ohms. The power factor of the circuit is:",
    opts: ["1.0", "0.707", "0.5", "0.0"],
    ans: "A",
    sol: "Impedance Z = sqrt(R^2 + (X_L - X_C)^2) = sqrt(10^2 + 0^2) = 10 ohms. Circuit is at resonance. Power factor cos phi = R / Z = 10 / 10 = 1.0 (unity).",
    ref: "NCERT Class 12, Alternating Current"
  },
  {
    q: "A uniform electric field E = 500 N/C exists along +x direction. A potential difference (V_A - V_B) between point A (0, 0) and point B (4 m, 3 m) is:",
    opts: ["-2000 V", "+2000 V", "-2500 V", "+1500 V"],
    ans: "A",
    sol: "Potential difference V_B - V_A = - E . Delta r = - E_x * Delta x = - 500 * (4 - 0) = -2000 V. Thus V_A - V_B = +2000 V (or V_B - V_A = -2000 V).",
    ref: "NCERT Class 12, Electrostatic Potential"
  }
];

const chemistryQuestions = [
  {
    q: "Which of the following compounds exhibits both geometrical (cis-trans) and optical isomerism?",
    opts: ["[Pt(NH3)2 Cl2]", "[Co(en)2 Cl2]+", "[Cr(NH3)4 Cl2]+", "[Ni(CO)4]"],
    ans: "B",
    sol: "[Co(en)2 Cl2]+ has cis and trans geometrical isomers. The cis-[Co(en)2 Cl2]+ isomer is non-superimposable on its mirror image (chiral) and therefore exhibits optical isomerism.",
    ref: "NCERT Class 12, Coordination Compounds"
  },
  {
    q: "The correct order of increasing basicity in aqueous medium for aliphatic amines is:",
    opts: ["(CH3)2NH > CH3NH2 > (CH3)3N > NH3", "(CH3)3N > (CH3)2NH > CH3NH2 > NH3", "CH3NH2 > (CH3)2NH > (CH3)3N > NH3", "(CH3)2NH > (CH3)3N > CH3NH2 > NH3"],
    ans: "A",
    sol: "In aqueous solution, the basicity of methyl-substituted amines is governed by inductive effect, steric hindrance, and hydration of conjugate cation: 2 deg > 1 deg > 3 deg > NH3. Hence: (CH3)2NH > CH3NH2 > (CH3)3N > NH3.",
    ref: "NCERT Class 12, Amines"
  },
  {
    q: "For a first-order chemical reaction, the time required for 99.9% completion is related to half-life (t_1/2) by:",
    opts: ["t_99.9% = 10 * t_1/2", "t_99.9% = 3 * t_1/2", "t_99.9% = 6.6 * t_1/2", "t_99.9% = 2 * t_1/2"],
    ans: "A",
    sol: "t_99.9% = (2.303 / k) * log(100 / (100 - 99.9)) = (2.303 / k) * log(1000) = (2.303 / k) * 3. Since t_1/2 = 0.693 / k = (2.303 * log 2) / k = (2.303 * 0.3010) / k, the ratio is 3 / 0.3010 = 9.966 approx 10. Thus t_99.9% = 10 * t_1/2.",
    ref: "NCERT Class 12, Chemical Kinetics"
  },
  {
    q: "Which one of the following species is diamagnetic according to Molecular Orbital Theory?",
    opts: ["O2", "B2", "C2", "NO"],
    ans: "C",
    sol: "C2 has 12 electrons: (sigma 1s)^2 (sigma* 1s)^2 (sigma 2s)^2 (sigma* 2s)^2 (pi 2px)^2 = (pi 2py)^2. All electrons are paired in the pi molecular orbitals, hence C2 is diamagnetic. O2 and B2 have 2 unpaired electrons each, and NO has 1 unpaired electron.",
    ref: "NCERT Class 11, Chemical Bonding and Molecular Structure"
  },
  {
    q: "When 1 mole of benzoic acid is dissolved in benzene, it undergoes dimerization with degree of association alpha = 0.8. The van 't Hoff factor (i) is:",
    opts: ["0.6", "0.8", "1.4", "0.2"],
    ans: "A",
    sol: "For dimerization (n = 2): i = 1 - alpha + alpha/n = 1 - 0.8 + 0.8/2 = 0.2 + 0.4 = 0.6.",
    ref: "NCERT Class 12, Solutions"
  },
  {
    q: "The standard electrode potentials are E_deg(Zn2+/Zn) = -0.76 V and E_deg(Cu2+/Cu) = +0.34 V. The standard EMF of the Daniell cell is:",
    opts: ["+1.10 V", "+0.42 V", "-1.10 V", "+1.52 V"],
    ans: "A",
    sol: "E_deg_cell = E_deg_cathode - E_deg_anode = +0.34 V - (-0.76 V) = +1.10 V.",
    ref: "NCERT Class 12, Electrochemistry"
  },
  {
    q: "The IUPAC name of the complex K3[Fe(CN)6] is:",
    opts: ["Potassium hexacyanidoferrate(III)", "Potassium hexacyanidoferrate(II)", "Tripotassium hexacyanoiron(III)", "Potassium ferricyanide(III)"],
    ans: "A",
    sol: "K+ has +1 charge, so coordination sphere has -3 charge. Fe + 6(-1) = -3 => Fe = +3. Cation named first, then hexacyanido, central metal ends in -ate since complex is anionic. IUPAC name: Potassium hexacyanidoferrate(III).",
    ref: "NCERT Class 12, Coordination Compounds"
  },
  {
    q: "In Cannizzaro reaction, benzaldehyde reacts with concentrated NaOH to produce:",
    opts: ["Benzyl alcohol and sodium benzoate", "Benzophenone and benzoic acid", "Cinnamic acid and phenol", "Benzene and sodium formate"],
    ans: "A",
    sol: "Cannizzaro reaction is a disproportionation reaction of aldehydes lacking alpha-hydrogen. Two molecules of benzaldehyde in conc. NaOH yield benzyl alcohol (reduction product) and sodium benzoate (oxidation product).",
    ref: "NCERT Class 12, Aldehydes, Ketones and Carboxylic Acids"
  },
  {
    q: "Which transition metal ion among the following has the highest spin-only magnetic moment?",
    opts: ["Mn2+", "Fe2+", "Co2+", "Cr3+"],
    ans: "A",
    sol: "Mn2+ is d5 configuration with 5 unpaired electrons (mu = sqrt(5*7) = 5.92 BM). Fe2+ is d4/d6 (4 unpaired, 4.90 BM). Co2+ is d7 (3 unpaired, 3.87 BM). Cr3+ is d3 (3 unpaired, 3.87 BM). Mn2+ has the highest value.",
    ref: "NCERT Class 12, d and f Block Elements"
  },
  {
    q: "What is the pH of a 10^-8 M aqueous solution of HCl at 25 deg C?",
    opts: ["6.96", "8.00", "7.00", "7.04"],
    ans: "A",
    sol: "In very dilute acid solutions, H+ from auto-ionization of water cannot be neglected. Total [H+] = 10^-8 + 10^-7 = 1.1 * 10^-7 M (more accurately [H+]^2 - 10^-8 [H+] - 10^-14 = 0 => [H+] = 1.05 * 10^-7 M). pH = -log(1.05 * 10^-7) = 6.96 (slightly acidic, < 7).",
    ref: "NCERT Class 11, Equilibrium"
  },
  {
    q: "Phenol on reaction with chloroform and aqueous NaOH followed by acidification yields salicylaldehyde. This reaction is known as:",
    opts: ["Reimer-Tiemann reaction", "Kolbe-Schmitt reaction", "Rosenmund reduction", "Friedel-Crafts reaction"],
    ans: "A",
    sol: "Reimer-Tiemann reaction involves treating phenol with CHCl3 in presence of NaOH to form an o-hydroxybenzaldehyde (salicylaldehyde) via dichlorocarbene (:CCl2) intermediate.",
    ref: "NCERT Class 12, Alcohols, Phenols and Ethers"
  },
  {
    q: "Which of the following pairs of solutions forms an ideal solution obeying Raoult's law over all concentrations?",
    opts: ["Benzene + Toluene", "Ethanol + Acetone", "Chloroform + Acetone", "Water + Nitric acid"],
    ans: "A",
    sol: "Benzene and toluene have nearly identical molecular sizes and intermolecular forces (van der Waals), Delta H_mix = 0 and Delta V_mix = 0, thus forming an ideal solution.",
    ref: "NCERT Class 12, Solutions"
  },
  {
    q: "The hybridization and shape of XeF4 molecule according to VSEPR theory are:",
    opts: ["sp3d2, Square planar", "sp3d, See-saw", "sp3d2, Octahedral", "sp3, Tetrahedral"],
    ans: "A",
    sol: "Xe has 8 valence electrons. 4 bond pairs with F and 2 lone pairs. Steric number = 4 + 2 = 6, corresponding to sp3d2 hybridization. The two lone pairs occupy opposite axial positions, resulting in a square planar geometry.",
    ref: "NCERT Class 12, p-Block Elements (Noble Gases)"
  },
  {
    q: "Which polymer is formed by the condensation polymerization of hexamethylenediamine and adipic acid?",
    opts: ["Nylon 6,6", "Dacron", "Nylon 6", "Bakelite"],
    ans: "A",
    sol: "Condensation polymerization of hexamethylenediamine (6 carbons) and adipic acid (6 carbons) with elimination of water yields Nylon 6,6.",
    ref: "NCERT Class 12, Polymers"
  },
  {
    q: "An organic compound with molecular formula C3H6O forms an oxime with hydroxylamine and gives positive iodoform test. The compound is:",
    opts: ["Acetone (Propan-2-one)", "Propanal", "Methoxyethene", "Prop-2-en-1-ol"],
    ans: "A",
    sol: "Forms oxime => contains carbonyl group (aldehyde or ketone). Gives positive iodoform test => must contain CH3-C=O methyl ketone group. Only propan-2-one (acetone, CH3COCH3) satisfies both conditions.",
    ref: "NCERT Class 12, Aldehydes, Ketones and Carboxylic Acids"
  },
  {
    q: "The oxidation state of sulfur in Caro's acid (peroxomonosulfuric acid, H2SO5) is:",
    opts: ["+6", "+8", "+5", "+4"],
    ans: "A",
    sol: "H2SO5 has structure HO-SO2-O-O-H containing one peroxy linkage (-O-O- where each oxygen is in -1 state) and three normal oxide oxygens (-2). 2(+1) + S + 3(-2) + 2(-1) = 0 => S - 6 = 0 => S = +6.",
    ref: "NCERT Class 11, Redox Reactions & p-Block"
  },
  {
    q: "Lucas reagent is an equimolar mixture of:",
    opts: ["Anhydrous ZnCl2 and concentrated HCl", "Dilute HCl and ZnSO4", "Concentrated H2SO4 and Zn", "Concentrated HNO3 and ZnCl2"],
    ans: "A",
    sol: "Lucas reagent consists of anhydrous ZnCl2 and concentrated HCl. It is used to distinguish primary, secondary, and tertiary alcohols based on the rate of formation of insoluble alkyl chlorides.",
    ref: "NCERT Class 12, Alcohols, Phenols and Ethers"
  },
  {
    q: "Which of the following is NOT an extensive thermodynamic property?",
    opts: ["Molar heat capacity", "Enthalpy", "Volume", "Entropy"],
    ans: "A",
    sol: "Enthalpy, volume, and entropy depend on the quantity of matter present, so they are extensive properties. Molar heat capacity is the property per mole of substance (independent of total system size), so it is intensive.",
    ref: "NCERT Class 11, Thermodynamics"
  },
  {
    q: "The correct electronic configuration of Chromium (Cr, Z = 24) in ground state is:",
    opts: ["[Ar] 3d5 4s1", "[Ar] 3d4 4s2", "[Ar] 3d6 4s0", "[Ar] 3d3 4s2 4p1"],
    ans: "A",
    sol: "Due to the extra stability of half-filled d-subshell (d5) and exchange energy, one 4s electron is promoted to 3d, giving [Ar] 3d5 4s1 instead of [Ar] 3d4 4s2.",
    ref: "NCERT Class 11, Structure of Atom"
  },
  {
    q: "The order of reactivity of alkyl halides towards SN2 substitution mechanism is:",
    opts: ["1 deg > 2 deg > 3 deg", "3 deg > 2 deg > 1 deg", "2 deg > 1 deg > 3 deg", "3 deg > 1 deg > 2 deg"],
    ans: "A",
    sol: "SN2 involves backside nucleophilic attack in a single concerted step. Bulky alkyl groups create steric hindrance to the approaching nucleophile. Hence reactivity is: methyl > 1 deg > 2 deg > 3 deg.",
    ref: "NCERT Class 12, Haloalkanes and Haloarenes"
  },
  {
    q: "According to Kohlrausch's law, limiting molar conductivity of acetic acid (CH3COOH) can be obtained from:",
    opts: ["Lambda_m(CH3COONa) + Lambda_m(HCl) - Lambda_m(NaCl)", "Lambda_m(CH3COONa) + Lambda_m(NaCl) - Lambda_m(HCl)", "Lambda_m(HCl) + Lambda_m(NaCl) - Lambda_m(CH3COONa)", "Lambda_m(CH3COONa) - Lambda_m(HCl) - Lambda_m(NaCl)"],
    ans: "A",
    sol: "Lambda_deg(CH3COOH) = lambda_deg(CH3COO-) + lambda_deg(H+). Adding Lambda_deg(CH3COONa) and Lambda_deg(HCl) gives [CH3COO- + Na+ + H+ + Cl-]. Subtracting Lambda_deg(NaCl) [Na+ + Cl-] isolates CH3COO- + H+.",
    ref: "NCERT Class 12, Electrochemistry"
  },
  {
    q: "Which carbohydrate is known as invert sugar?",
    opts: ["Equimolar mixture of D-glucose and D-fructose from sucrose hydrolysis", "Starch", "Pure Maltose", "Cellulose"],
    ans: "A",
    sol: "Sucrose is dextrorotatory (+66.5 deg). On hydrolysis, it gives an equimolar mixture of D-(+)-glucose (+52.5 deg) and D-(-)-fructose (-92.4 deg). The resulting mixture is levorotatory (-39.9 deg). Due to inversion in sign of optical rotation, it is called invert sugar.",
    ref: "NCERT Class 12, Biomolecules"
  },
  {
    q: "The work done during isothermal reversible expansion of 1 mole of an ideal gas from volume V1 to V2 is given by:",
    opts: ["-2.303 R T log(V2 / V1)", "+2.303 R T log(V1 / V2)", "-R T (V2 - V1)", "-C_v (T2 - T1)"],
    ans: "A",
    sol: "W_rev = - integral(P dV) = - integral(n R T / V dV) = - n R T ln(V2 / V1) = - 2.303 n R T log(V2 / V1). For n = 1 mole, W = -2.303 R T log(V2 / V1).",
    ref: "NCERT Class 11, Chemical Thermodynamics"
  },
  {
    q: "Which of the following compounds gives a silver mirror with Tollens' reagent?",
    opts: ["Formic acid (HCOOH)", "Acetic acid (CH3COOH)", "Acetone", "Benzophenone"],
    ans: "A",
    sol: "Formic acid contains both a carboxylic acid group and an aldehydic -C(=O)H group. Due to this reducing aldehydic group, it reduces Tollens' reagent to metallic silver (silver mirror).",
    ref: "NCERT Class 12, Aldehydes, Ketones and Carboxylic Acids"
  },
  {
    q: "The number of tetrahedral and octahedral voids in a ccp (fcc) lattice of N atoms are respectively:",
    opts: ["2N and N", "N and 2N", "N and N", "2N and 2N"],
    ans: "A",
    sol: "In a close-packed arrangement of N spheres (atoms), the number of octahedral voids is N, and the number of tetrahedral voids is 2N.",
    ref: "NCERT Class 12, Solid State"
  }
];

const mathQuestions = [
  {
    q: "The value of integral from 0 to pi/2 of (sin^2024(x)) / (sin^2024(x) + cos^2024(x)) dx is:",
    opts: ["pi / 4", "pi / 2", "pi", "0"],
    ans: "A",
    sol: "Using King's property: I = integral_0^(pi/2) f(x) dx = integral_0^(pi/2) f(pi/2 - x) dx. Here f(pi/2 - x) = cos^2024(x) / (cos^2024(x) + sin^2024(x)). Adding 2I = integral_0^(pi/2) 1 dx = [x]_0^(pi/2) = pi/2 => I = pi / 4.",
    ref: "NCERT Class 12, Definite Integrals"
  },
  {
    q: "If matrix A = [[cos theta, -sin theta], [sin theta, cos theta]], then A^n equals:",
    opts: ["[[cos(n theta), -sin(n theta)], [sin(n theta), cos(n theta)]]", "[[cos^n(theta), -sin^n(theta)], [sin^n(theta), cos^n(theta)]]", "n * A", "I"],
    ans: "A",
    sol: "By mathematical induction or De Moivre's theorem on 2D rotation matrices, rotation by angle theta applied n times equals rotation by angle n*theta.",
    ref: "NCERT Class 12, Matrices"
  },
  {
    q: "The shortest distance between the skew lines r = (i + 2j + 3k) + lambda(2i + 3j + 4k) and r = (2i + 4j + 5k) + mu(3i + 4j + 5k) is:",
    opts: ["1 / sqrt(6)", "2 / sqrt(6)", "1 / sqrt(3)", "0"],
    ans: "A",
    sol: "Shortest distance d = |(a2 - a1) . (b1 x b2)| / |b1 x b2|. Here a2 - a1 = i + 2j + 2k. b1 x b2 = (2i+3j+4k) x (3i+4j+5k) = -i + 2j - k. Dot product = 1(-1) + 2(2) + 2(-1) = -1 + 4 - 2 = 1. Magnitude |b1 x b2| = sqrt(1 + 4 + 1) = sqrt(6). Distance = 1 / sqrt(6).",
    ref: "NCERT Class 12, Three Dimensional Geometry"
  },
  {
    q: "The limit as x approaches 0 of (sin x - x + x^3 / 6) / x^5 equals:",
    opts: ["1 / 120", "-1 / 120", "1 / 24", "0"],
    ans: "A",
    sol: "Using Taylor series expansion for sin x: sin x = x - x^3 / 3! + x^5 / 5! - ... = x - x^3 / 6 + x^5 / 120 - ... Thus sin x - x + x^3 / 6 = x^5 / 120 - O(x^7). Dividing by x^5 as x -> 0 gives 1 / 120.",
    ref: "NCERT Class 11 & 12, Limits and Derivatives"
  },
  {
    q: "If z is a complex number such that |z - 4/z| = 2, the maximum value of |z| is:",
    opts: ["sqrt(5) + 1", "sqrt(5) - 1", "sqrt(5)", "2"],
    ans: "A",
    sol: "By triangle inequality: |z| = |(z - 4/z) + 4/z| <= |z - 4/z| + 4/|z| = 2 + 4/|z|. Let r = |z| > 0: r <= 2 + 4/r => r^2 - 2r - 4 <= 0 => (r - 1)^2 <= 5 => r <= 1 + sqrt(5).",
    ref: "NCERT Class 11, Complex Numbers"
  },
  {
    q: "The area of the region enclosed between the parabolas y^2 = 4x and x^2 = 4y is:",
    opts: ["16 / 3", "32 / 3", "8 / 3", "16"],
    ans: "A",
    sol: "Standard formula for area between y^2 = 4ax and x^2 = 4by is Area = 16 a b / 3. Here 4a = 4 => a = 1, and 4b = 4 => b = 1. Area = 16(1)(1) / 3 = 16 / 3 sq units.",
    ref: "NCERT Class 12, Application of Integrals"
  },
  {
    q: "The number of words that can be formed using all letters of the word 'MATHEMATICS' such that vowels always occur together is:",
    opts: ["120960", "75600", "241920", "483840"],
    ans: "A",
    sol: "Vowels in MATHEMATICS: A, E, A, I (4 vowels: 2 A's, 1 E, 1 I). Consonants: M, T, H, M, T, C, S (7 consonants: 2 M's, 2 T's, 1 H, 1 C, 1 S). Bundle 4 vowels as 1 unit. Total units = 7 + 1 = 8. Units can be arranged in 8! / (2! * 2!) ways. Vowels within bundle can be arranged in 4! / 2! ways. Total = (40320 / 4) * (24 / 2) = 10080 * 12 = 120960.",
    ref: "NCERT Class 11, Permutations and Combinations"
  },
  {
    q: "The general solution of the differential equation dy/dx + y * cot x = 2 * cos x is:",
    opts: ["y * sin x = sin^2(x) + C", "y * cos x = sin^2(x) + C", "y = 2 sin x + C", "y * sin x = 2 x + C"],
    ans: "A",
    sol: "Linear differential equation in standard form dy/dx + P y = Q with P = cot x, Q = 2 cos x. Integrating factor I.F. = e^(integral cot x dx) = e^(ln sin x) = sin x. Solution: y * sin x = integral(2 cos x * sin x dx) = integral(sin 2x dx) = -cos(2x)/2 + C' = sin^2 x + C.",
    ref: "NCERT Class 12, Differential Equations"
  },
  {
    q: "If a, b, c are in arithmetic progression (AP), then the line a*x + b*y + c = 0 always passes through the fixed point:",
    opts: ["(1, -2)", "(-1, 2)", "(1, 2)", "(2, -1)"],
    ans: "A",
    sol: "Since a, b, c are in AP: 2b = a + c => a - 2b + c = 0. Comparing with ax + by + c = 0 yields x = 1 and y = -2. Thus the line always passes through (1, -2).",
    ref: "NCERT Class 11, Straight Lines"
  },
  {
    q: "The coefficient of x^7 in the expansion of (1 + x)^10 * (1 - x)^7 is:",
    opts: ["-84", "+84", "-42", "+42"],
    ans: "A",
    sol: "Expression = (1 + x)^3 * [(1 + x)(1 - x)]^7 = (1 + 3x + 3x^2 + x^3) * (1 - x^2)^7. General term of (1 - x^2)^7 is (-1)^r * C(7, r) * x^(2r). For x^7: from x^3 * x^4 (r=2) gives 1 * (-1)^2 * C(7, 2) = 21. From 3x * x^6 (r=3) gives 3 * (-1)^3 * C(7, 3) = -3 * 35 = -105. Total coefficient = 21 - 105 = -84.",
    ref: "NCERT Class 11, Binomial Theorem"
  },
  {
    q: "The probability of getting at least 4 heads in 6 tosses of an unbiased coin is:",
    opts: ["11 / 32", "1 / 2", "7 / 16", "5 / 16"],
    ans: "A",
    sol: "Binomial probability P(X >= 4) = P(4) + P(5) + P(6). P(4) = C(6, 4) * (1/2)^6 = 15/64. P(5) = C(6, 5) * (1/2)^6 = 6/64. P(6) = C(6, 6) * (1/2)^6 = 1/64. Total = (15 + 6 + 1) / 64 = 22 / 64 = 11 / 32.",
    ref: "NCERT Class 12, Probability"
  },
  {
    q: "The eccentricity of the hyperbola 9 x^2 - 16 y^2 = 144 is:",
    opts: ["5 / 4", "5 / 3", "4 / 3", "sqrt(7) / 4"],
    ans: "A",
    sol: "Dividing by 144: x^2 / 16 - y^2 / 9 = 1. Here a^2 = 16 and b^2 = 9. For hyperbola: b^2 = a^2 (e^2 - 1) => 9 = 16(e^2 - 1) => e^2 - 1 = 9/16 => e^2 = 25/16 => e = 5 / 4.",
    ref: "NCERT Class 11, Conic Sections"
  },
  {
    q: "If vector a and vector b are unit vectors such that |a + b| = sqrt(3), then the angle between a and b is:",
    opts: ["pi / 3 (60 deg)", "pi / 6 (30 deg)", "pi / 2 (90 deg)", "2 pi / 3 (120 deg)"],
    ans: "A",
    sol: "|a + b|^2 = |a|^2 + |b|^2 + 2 |a| |b| cos theta = 1 + 1 + 2(1)(1) cos theta = 2 + 2 cos theta. Given |a + b|^2 = 3 => 2 + 2 cos theta = 3 => 2 cos theta = 1 => cos theta = 1/2 => theta = pi / 3 (60 degrees).",
    ref: "NCERT Class 12, Vector Algebra"
  },
  {
    q: "The minimum value of f(x) = 2x^3 - 9x^2 + 12x + 5 on the closed interval [0, 3] is:",
    opts: ["5", "9", "14", "1"],
    ans: "A",
    sol: "f'(x) = 6x^2 - 18x + 12 = 6(x^2 - 3x + 2) = 6(x - 1)(x - 2). Critical points are x = 1, x = 2. Values: f(0) = 5. f(1) = 2 - 9 + 12 + 5 = 10. f(2) = 16 - 36 + 24 + 5 = 9. f(3) = 54 - 81 + 36 + 5 = 14. Global minimum is f(0) = 5.",
    ref: "NCERT Class 12, Application of Derivatives"
  },
  {
    q: "The sum of the infinite series 1 + 2/3 + 3/3^2 + 4/3^3 + ... is:",
    opts: ["9 / 4", "3 / 2", "4 / 3", "3"],
    ans: "A",
    sol: "Arithmetico-Geometric series S = 1 + 2r + 3r^2 + ... with r = 1/3. Sum S = a / (1 - r) + d r / (1 - r)^2 = 1 / (2/3) + (1 * 1/3) / (2/3)^2 = 3/2 + (1/3) / (4/9) = 3/2 + 3/4 = 9 / 4.",
    ref: "NCERT Class 11, Sequences and Series"
  },
  {
    q: "If roots of x^2 - p x + q = 0 differ by unity, then:",
    opts: ["p^2 - 4q = 1", "p^2 - 4q = 4", "p^2 + 4q = 1", "p^2 - 4q = -1"],
    ans: "A",
    sol: "Roots alpha, beta have |alpha - beta| = 1. (alpha - beta)^2 = (alpha + beta)^2 - 4 alpha beta = p^2 - 4q. Since (alpha - beta)^2 = 1^2 = 1, we get p^2 - 4q = 1.",
    ref: "NCERT Class 11, Quadratic Equations"
  },
  {
    q: "The value of determinant |[1, a, a^2], [1, b, b^2], [1, c, c^2]| is:",
    opts: ["(a - b)(b - c)(c - a)", "(a + b)(b + c)(c + a)", "a b c (a + b + c)", "0"],
    ans: "A",
    sol: "Standard Vandermonde determinant of order 3. Factoring gives (b - a)(c - a)(c - b) = (a - b)(b - c)(c - a).",
    ref: "NCERT Class 12, Determinants"
  },
  {
    q: "The angle between the lines whose direction cosines satisfy l + m + n = 0 and l^2 + m^2 - n^2 = 0 is:",
    opts: ["pi / 3 (60 deg)", "pi / 2 (90 deg)", "pi / 4 (45 deg)", "pi / 6 (30 deg)"],
    ans: "A",
    sol: "Substitute n = -(l + m) into second equation: l^2 + m^2 - (l + m)^2 = 0 => l^2 + m^2 - (l^2 + 2lm + m^2) = 0 => -2lm = 0 => l = 0 or m = 0. When l = 0: m + n = 0 => n = -m, ratios are (0, 1, -1). When m = 0: l + n = 0 => n = -l, ratios are (1, 0, -1). Cos theta = |0(1) + 1(0) + (-1)(-1)| / (sqrt(2) * sqrt(2)) = 1 / 2 => theta = 60 degrees (pi / 3).",
    ref: "NCERT Class 12, Three Dimensional Geometry"
  },
  {
    q: "The domain of the function f(x) = sin^(-1)(2x - 1) + sqrt(1 - x^2) is:",
    opts: ["[0, 1]", "[-1, 1]", "[0, 1/2]", "[-1/2, 1]"],
    ans: "A",
    sol: "For sin^(-1)(2x - 1): -1 <= 2x - 1 <= 1 => 0 <= 2x <= 2 => 0 <= x <= 1. For sqrt(1 - x^2): 1 - x^2 >= 0 => -1 <= x <= 1. Intersection of [0, 1] and [-1, 1] is [0, 1].",
    ref: "NCERT Class 12, Inverse Trigonometric Functions"
  },
  {
    q: "A bag contains 5 red and 3 green balls. Two balls are drawn at random one after another without replacement. The probability that both balls are red is:",
    opts: ["5 / 14", "25 / 64", "5 / 8", "15 / 56"],
    ans: "A",
    sol: "P(first red) = 5/8. P(second red | first red) = 4/7. P(both red) = (5/8) * (4/7) = 20 / 56 = 5 / 14.",
    ref: "NCERT Class 12, Probability"
  },
  {
    q: "The equation of normal to the parabola y^2 = 4x at point (1, 2) is:",
    opts: ["x + y - 3 = 0", "x - y + 1 = 0", "2x + y - 4 = 0", "x + 2y - 5 = 0"],
    ans: "A",
    sol: "Differentiating y^2 = 4x gives 2y dy/dx = 4 => dy/dx = 2/y. At (1, 2), tangent slope m_t = 2/2 = 1. Normal slope m_n = -1. Normal line equation: y - 2 = -1 (x - 1) => y - 2 = -x + 1 => x + y - 3 = 0.",
    ref: "NCERT Class 12, Application of Derivatives"
  },
  {
    q: "The number of solutions of the equation cos x = |x| is:",
    opts: ["2", "1", "0", "Infinitely many"],
    ans: "A",
    sol: "cos x is an even function with range [-1, 1]. |x| is V-shaped, symmetric about y-axis. At x = 0, cos(0) = 1 > 0. For x > 0, cos x starts at 1 and decreases while y = x increases. They intersect at exactly one positive root x_0 in (0, pi/2) (approx x_0 = 0.739 rad). By symmetry, they intersect at -x_0 as well. Total solutions = 2.",
    ref: "NCERT Class 11, Trigonometric Functions"
  },
  {
    q: "The value of integral from -1 to 1 of x * |x| dx is:",
    opts: ["0", "2 / 3", "1 / 3", "-2 / 3"],
    ans: "A",
    sol: "Let f(x) = x * |x|. Then f(-x) = (-x) * |-x| = -x * |x| = -f(x). The integrand is an odd function. The integral of any odd function over symmetric limits [-a, a] is identically 0.",
    ref: "NCERT Class 12, Definite Integrals"
  },
  {
    q: "If the mean and variance of a binomial distribution are 4 and 2 respectively, the number of trials n is:",
    opts: ["8", "16", "4", "12"],
    ans: "A",
    sol: "Mean = n p = 4. Variance = n p q = 2. Dividing gives q = 2 / 4 = 1/2. Therefore p = 1 - q = 1/2. From n p = 4: n * (1/2) = 4 => n = 8.",
    ref: "NCERT Class 12, Probability"
  },
  {
    q: "The radius of the circle passing through the points (0, 0), (a, 0), and (0, b) is:",
    opts: ["sqrt(a^2 + b^2) / 2", "sqrt(a^2 + b^2)", "(a + b) / 2", "a b / 2"],
    ans: "A",
    sol: "The triangle formed by (0, 0), (a, 0), (0, b) is a right-angled triangle with the right angle at origin (0, 0). The hypotenuse is the segment joining (a, 0) and (0, b), which forms the diameter of the circumcircle. Diameter length = sqrt(a^2 + b^2), so circumradius R = sqrt(a^2 + b^2) / 2.",
    ref: "NCERT Class 11, Circles"
  }
];

// Read existing bank
const bankPath = path.join(__dirname, '..', 'data', 'mcq', 'questions_bank.json');
const publicBankPath = path.join(__dirname, '..', 'public', 'data', 'mcq', 'questions_bank.json');

let bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

// Filter out any existing JEE-2024-JAN-S1 questions
bank = bank.filter(q => q.testId !== 'JEE-2024-JAN-S1');

const allJeeQuestions = [];

physicsQuestions.forEach((item, idx) => {
  allJeeQuestions.push({
    id: `JEE-2024-JAN-S1-P${idx + 1}`,
    testId: "JEE-2024-JAN-S1",
    exam: "JEE-MAIN",
    subject: "Physics",
    chapterId: "physics-core",
    qNumber: idx + 1,
    year: 2024,
    difficulty: idx % 3 === 0 ? "Hard" : (idx % 2 === 0 ? "Moderate" : "Easy"),
    question: item.q,
    options: item.opts.map((text, i) => ({
      id: String.fromCharCode(65 + i),
      text: text
    })),
    correct: item.ans,
    explanation: item.sol,
    ncertRef: item.ref
  });
});

chemistryQuestions.forEach((item, idx) => {
  allJeeQuestions.push({
    id: `JEE-2024-JAN-S1-C${idx + 1}`,
    testId: "JEE-2024-JAN-S1",
    exam: "JEE-MAIN",
    subject: "Chemistry",
    chapterId: "chemistry-core",
    qNumber: 25 + idx + 1,
    year: 2024,
    difficulty: idx % 3 === 0 ? "Hard" : (idx % 2 === 0 ? "Moderate" : "Easy"),
    question: item.q,
    options: item.opts.map((text, i) => ({
      id: String.fromCharCode(65 + i),
      text: text
    })),
    correct: item.ans,
    explanation: item.sol,
    ncertRef: item.ref
  });
});

mathQuestions.forEach((item, idx) => {
  allJeeQuestions.push({
    id: `JEE-2024-JAN-S1-M${idx + 1}`,
    testId: "JEE-2024-JAN-S1",
    exam: "JEE-MAIN",
    subject: "Mathematics",
    chapterId: "math-core",
    qNumber: 50 + idx + 1,
    year: 2024,
    difficulty: idx % 3 === 0 ? "Hard" : (idx % 2 === 0 ? "Moderate" : "Easy"),
    question: item.q,
    options: item.opts.map((text, i) => ({
      id: String.fromCharCode(65 + i),
      text: text
    })),
    correct: item.ans,
    explanation: item.sol,
    ncertRef: item.ref
  });
});

console.log(`Generated ${allJeeQuestions.length} questions for JEE-2024-JAN-S1!`);

const updatedBank = [...bank, ...allJeeQuestions];

fs.writeFileSync(bankPath, JSON.stringify(updatedBank, null, 2), 'utf8');
fs.writeFileSync(publicBankPath, JSON.stringify(updatedBank, null, 2), 'utf8');

console.log(`Successfully updated questions bank! Total questions in database: ${updatedBank.length} (Added ${allJeeQuestions.length} JEE questions)`);

