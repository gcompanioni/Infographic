// Chemistry calculations for weak acid (CH3COOH) - strong base (NaOH) titration

export type TitrationStage = 
  | 'initial'
  | 'buffer'
  | 'half_equivalence'
  | 'steep'
  | 'equivalence'
  | 'beyond';

export type StageInfo = {
  stage: TitrationStage;
  title: string;
  description: string;
  dominantSpecies: string;
  relevantEquation: string;
};

// Constants for the titration
const ACID_VOLUME_ML = 25.0; // mL of CH3COOH
const ACID_CONCENTRATION = 0.120; // M
const BASE_CONCENTRATION = 0.100; // M
const KA = 1.8e-5; // Ka for acetic acid
const PKA = -Math.log10(KA); // pKa = 4.74

// Calculate pH based on volume of NaOH added
export function calculatePH(volumeNaOHAdded: number): number {
  const molesAcid = ACID_VOLUME_ML * ACID_CONCENTRATION / 1000; // Convert mL to L
  const molesBaseAdded = volumeNaOHAdded * BASE_CONCENTRATION / 1000;
  const totalVolume = (ACID_VOLUME_ML + volumeNaOHAdded) / 1000; // L

  // Case 1: Initial state (no base added)
  if (volumeNaOHAdded === 0) {
    // pH of weak acid: pH = 1/2(pKa - log C)
    const pH = 0.5 * (PKA - Math.log10(ACID_CONCENTRATION));
    return Math.round(pH * 100) / 100;
  }

  // Case 2: Before equivalence point (buffer region)
  if (molesBaseAdded < molesAcid) {
    const molesAcidRemaining = molesAcid - molesBaseAdded;
    const molesConjugateBase = molesBaseAdded;
    // Henderson-Hasselbalch: pH = pKa + log([A-]/[HA])
    const pH = PKA + Math.log10(molesConjugateBase / molesAcidRemaining);
    return Math.round(pH * 100) / 100;
  }

  // Case 3: Equivalence point (all acid neutralized)
  if (Math.abs(molesBaseAdded - molesAcid) < 1e-10) {
    const acetateConcentration = molesAcid / totalVolume;
    // pH from weak base hydrolysis: pH = 7 + 1/2(pKa + log C)
    const pH = 7 + 0.5 * (PKA + Math.log10(acetateConcentration));
    return Math.round(pH * 100) / 100;
  }

  // Case 4: Beyond equivalence point (excess base)
  const excessMolesBase = molesBaseAdded - molesAcid;
  const excessOHConcentration = excessMolesBase / totalVolume;
  const pOH = -Math.log10(excessOHConcentration);
  const pH = 14 - pOH;
  return Math.round(pH * 100) / 100;
}

// Determine the current stage of titration
export function determineTitrationStage(volumeNaOHAdded: number): StageInfo {
  const equivalenceVolume = 30.0; // mL (M1V1 = M2V2 -> 0.120*25.0 = 0.100*V2 -> V2 = 30.0)

  if (volumeNaOHAdded === 0) {
    return {
      stage: 'initial',
      title: 'Initial State - Weak Acid Solution',
      description: 'Pure acetic acid solution. CH₃COOH establishes equilibrium with water, producing H⁺ and CH₃COO⁻ ions.',
      dominantSpecies: 'CH₃COOH (mostly undissociated)',
      relevantEquation: 'CH₃COOH ⇌ CH₃COO⁻ + H⁺  (Ka = 1.8 × 10⁻⁵)',
    };
  }

  if (volumeNaOHAdded > 0 && volumeNaOHAdded < 13) {
    return {
      stage: 'buffer',
      title: 'Buffer Region - Early Stage',
      description: 'Mixture of CH₃COOH and CH₃COO⁻ forms a buffer solution. The buffer resists pH changes.',
      dominantSpecies: 'CH₃COOH and CH₃COO⁻ (both present)',
      relevantEquation: 'pH = pKa + log([CH₃COO⁻]/[CH₃COOH])',
    };
  }

  if (volumeNaOHAdded >= 13 && volumeNaOHAdded < 17) {
    return {
      stage: 'half_equivalence',
      title: 'Half-Equivalence Point Region',
      description: 'At 15.0 mL exactly, [CH₃COOH] = [CH₃COO⁻], so pH = pKa = 4.74. This is used to determine pKa experimentally.',
      dominantSpecies: 'CH₃COOH ≈ CH₃COO⁻ (equal amounts)',
      relevantEquation: 'pH = pKa = 4.74 (when [CH₃COO⁻] = [CH₃COOH])',
    };
  }

  if (volumeNaOHAdded >= 17 && volumeNaOHAdded < 28) {
    return {
      stage: 'buffer',
      title: 'Buffer Region - Late Stage',
      description: 'Still in buffer region but more CH₃COO⁻ than CH₃COOH. Buffer capacity is decreasing.',
      dominantSpecies: 'CH₃COO⁻ (major), CH₃COOH (minor)',
      relevantEquation: 'pH = pKa + log([CH₃COO⁻]/[CH₃COOH])',
    };
  }

  if (volumeNaOHAdded >= 28 && volumeNaOHAdded < 30) {
    return {
      stage: 'steep',
      title: 'Steep Region - Approaching Equivalence',
      description: 'Very little CH₃COOH remains. pH changes rapidly with each drop of base. Buffer capacity nearly exhausted.',
      dominantSpecies: 'CH₃COO⁻ (dominant), trace CH₃COOH',
      relevantEquation: 'pH rising rapidly as buffer capacity fails',
    };
  }

  if (Math.abs(volumeNaOHAdded - equivalenceVolume) < 0.5) {
    return {
      stage: 'equivalence',
      title: 'Equivalence Point',
      description: 'All CH₃COOH has been neutralized. Only CH₃COO⁻ and Na⁺ remain. The acetate ion hydrolyzes, making the solution basic (pH > 7).',
      dominantSpecies: 'CH₃COO⁻ and Na⁺',
      relevantEquation: 'CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻  (Kb = Kw/Ka)',
    };
  }

  return {
    stage: 'beyond',
    title: 'Beyond Equivalence - Excess Base',
    description: 'Excess NaOH is present. pH is now controlled by the strong base, not the acetate buffer.',
    dominantSpecies: 'CH₃COO⁻, Na⁺, and excess OH⁻',
    relevantEquation: 'pH = 14 - pOH, where pOH = -log[OH⁻]',
  };
}

// Get solution color based on pH (litmus paper indicator)
export function getSolutionColor(pH: number): string {
  // Vibrant color scale showing titration progress:
  // Red (pH < 5) → Pink/Purple (pH 5-7) → Purple (pH 7) → Blue/Purple (pH 7-9) → Blue (pH > 9)
  // Acidic red: rgba(255, 50, 50, 0.7)
  // Neutral purple: rgba(170, 100, 200, 0.7)
  // Basic blue: rgba(50, 100, 255, 0.7)
  
  if (pH < 5) {
    // Bright red for acidic - gradient from more vibrant to slightly less intense
    const intensity = Math.max(1 - (pH / 5) * 0.3, 0.7);
    return `rgba(255, 50, 50, ${intensity})`;
  }
  
  if (pH < 7) {
    // Transition from bright red to purple
    const transitionFactor = (pH - 5) / 2;
    const red = Math.round(255 - (255 - 170) * transitionFactor);
    const green = Math.round(50 + (100 - 50) * transitionFactor);
    const blue = Math.round(50 + (200 - 50) * transitionFactor);
    return `rgba(${red}, ${green}, ${blue}, 0.7)`;
  }
  
  if (pH === 7) {
    // Neutral purple
    return `rgba(170, 100, 200, 0.7)`;
  }
  
  if (pH < 9) {
    // Transition from purple to bright blue
    const transitionFactor = (pH - 7) / 2;
    const red = Math.round(170 - (170 - 50) * transitionFactor);
    const green = Math.round(100 - (100 - 100) * transitionFactor);
    const blue = Math.round(200 + (255 - 200) * transitionFactor);
    return `rgba(${red}, ${green}, ${blue}, 0.7)`;
  }
  
  // Bright blue for basic
  return `rgba(50, 100, 255, 0.7)`;
}

export const TITRATION_CONSTANTS = {
  acidVolume: ACID_VOLUME_ML,
  acidConcentration: ACID_CONCENTRATION,
  baseConcentration: BASE_CONCENTRATION,
  equivalenceVolume: 30.0,
  pKa: PKA,
};