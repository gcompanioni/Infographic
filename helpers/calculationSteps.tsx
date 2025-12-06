import { TitrationStage } from './titrationChemistry';

export type CalculationStep = {
  step: number;
  title: string;
  explanation: string;
  calculation: string;
  result: string;
};

export type WorkedSolution = {
  isKeyPoint: boolean;
  keyPointLabel?: string;
  steps: CalculationStep[];
  keyConcept?: {
    title: string;
    explanation: string;
  };
};

const PKA = 4.74;
const KA = 1.8e-5;

export function getWorkedSolution(
  volumeNaOH: number,
  stage: TitrationStage,
  pH: number
): WorkedSolution {
  const molesAcid = (25.0 * 0.120) / 1000;
  const molesBase = (volumeNaOH * 0.100) / 1000;
  const totalVolume = (25.0 + volumeNaOH) / 1000;

  // Check if at key point
  const isKeyPoint = volumeNaOH === 0 || volumeNaOH === 15.0 || volumeNaOH === 30.0 || volumeNaOH === 36.0;
  const keyPointLabel = isKeyPoint
    ? volumeNaOH === 0
      ? 'Initial (0.0 mL)'
      : volumeNaOH === 15.0
        ? 'Half-Equivalence (15.0 mL)'
        : volumeNaOH === 30.0
          ? 'Equivalence Point (30.0 mL)'
          : 'Beyond Equivalence (36.0 mL)'
    : undefined;

  // Initial state
  if (volumeNaOH === 0) {
    return {
      isKeyPoint: true,
      keyPointLabel,
      steps: [
        {
          step: 1,
          title: 'Identify the problem type',
          explanation: 'Pure weak acid solution - use weak acid equilibrium',
          calculation: 'CH₃COOH ⇌ CH₃COO⁻ + H⁺',
          result: 'Ka = 1.8 × 10⁻⁵',
        },
        {
          step: 2,
          title: 'Apply weak acid formula',
          explanation: 'For weak acid: pH = ½(pKa - log C)',
          calculation: `pH = ½(${PKA.toFixed(2)} - log(0.120))`,
          result: `pH = ½(${PKA.toFixed(2)} - (${Math.log10(0.120).toFixed(2)})) = ½(${(PKA - Math.log10(0.120)).toFixed(2)})`,
        },
        {
          step: 3,
          title: 'Calculate final pH',
          explanation: 'Complete the calculation',
          calculation: `pH = ${pH.toFixed(2)}`,
          result: `pH = ${pH.toFixed(2)}`,
        },
      ],
      keyConcept: {
        title: 'Weak Acid Equilibrium',
        explanation:
          'Weak acids only partially dissociate. We use the simplified formula for weak acid pH when the acid is much stronger than water (Ka >> Kw).',
      },
    };
  }

  // Buffer region (before equivalence)
  if (stage === 'buffer' || stage === 'half_equivalence' || stage === 'steep') {
    const molesHA = molesAcid - molesBase;
    const molesA = molesBase;
    const isHalfEq = Math.abs(volumeNaOH - 15.0) < 0.1;

    return {
      isKeyPoint: isKeyPoint,
      keyPointLabel,
      steps: [
        {
          step: 1,
          title: 'Calculate initial moles',
          explanation: 'Find moles of acid and base',
          calculation: `n(CH₃COOH) = 0.0250 L × 0.120 M = ${molesAcid.toFixed(5)} mol\nn(NaOH) = ${(volumeNaOH / 1000).toFixed(5)} L × 0.100 M = ${molesBase.toFixed(5)} mol`,
          result: `${molesAcid.toFixed(5)} mol acid, ${molesBase.toFixed(5)} mol base`,
        },
        {
          step: 2,
          title: 'Neutralization reaction',
          explanation: 'Base converts acid to conjugate base',
          calculation: `CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O\nRemaining: ${molesHA.toFixed(5)} mol HA, ${molesA.toFixed(5)} mol A⁻`,
          result: `[HA] = ${molesHA.toFixed(5)} mol, [A⁻] = ${molesA.toFixed(5)} mol`,
        },
        {
          step: 3,
          title: 'Apply Henderson-Hasselbalch',
          explanation: isHalfEq ? 'At half-equivalence: [HA] = [A⁻], so pH = pKa' : 'Use buffer equation',
          calculation: isHalfEq
            ? `pH = pKa = ${PKA.toFixed(2)}`
            : `pH = pKa + log([A⁻]/[HA])\npH = ${PKA.toFixed(2)} + log(${molesA.toFixed(5)}/${molesHA.toFixed(5)})`,
          result: `pH = ${PKA.toFixed(2)} + ${(Math.log10(molesA / molesHA)).toFixed(2)}`,
        },
        {
          step: 4,
          title: 'Calculate final pH',
          explanation: 'Complete the calculation',
          calculation: `pH = ${pH.toFixed(2)}`,
          result: `pH = ${pH.toFixed(2)}`,
        },
      ],
      keyConcept: {
        title: 'Buffer Solution',
        explanation: isHalfEq
          ? 'At half-equivalence point, exactly half the acid is neutralized. [HA] = [A⁻], so the log term equals zero and pH = pKa. This is used to experimentally determine pKa!'
          : 'A buffer contains both a weak acid (HA) and its conjugate base (A⁻). It resists pH changes because added H⁺ reacts with A⁻ and added OH⁻ reacts with HA.',
      },
    };
  }

  // Equivalence point
  if (stage === 'equivalence') {
    const molesAcetate = molesAcid;
    const concentrationAcetate = molesAcetate / totalVolume;
    const Kb = 1e-14 / KA;
    const OH = Math.sqrt(Kb * concentrationAcetate);
    const pOH = -Math.log10(OH);

    return {
      isKeyPoint: true,
      keyPointLabel,
      steps: [
        {
          step: 1,
          title: 'Identify species present',
          explanation: 'All acid neutralized - only salt remains',
          calculation: `CH₃COOH + NaOH → CH₃COO⁻Na⁺ + H₂O\nAll acid converted to acetate ion`,
          result: 'Only CH₃COO⁻ (weak base) present',
        },
        {
          step: 2,
          title: 'Calculate acetate concentration',
          explanation: 'Total volume increased due to added NaOH',
          calculation: `[CH₃COO⁻] = ${molesAcetate.toFixed(5)} mol / ${(totalVolume).toFixed(5)} L`,
          result: `[CH₃COO⁻] = ${concentrationAcetate.toFixed(4)} M`,
        },
        {
          step: 3,
          title: 'Acetate hydrolysis (weak base)',
          explanation: 'Acetate ion accepts proton from water',
          calculation: `CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻\nKb = Kw/Ka = 1.0×10⁻¹⁴ / 1.8×10⁻⁵ = ${Kb.toExponential(2)}`,
          result: `Kb = ${Kb.toExponential(2)}`,
        },
        {
          step: 4,
          title: 'Set up ICE table and solve',
          explanation: 'Assume x << C, so [OH⁻] ≈ √(Kb × C)',
          calculation: `[OH⁻] = √(${Kb.toExponential(2)} × ${concentrationAcetate.toFixed(4)})\n[OH⁻] = ${OH.toExponential(2)} M\npOH = ${pOH.toFixed(2)}`,
          result: `pOH = ${pOH.toFixed(2)}`,
        },
        {
          step: 5,
          title: 'Calculate pH',
          explanation: 'Use pH + pOH = 14',
          calculation: `pH = 14 - pOH = 14 - ${pOH.toFixed(2)}`,
          result: `pH = ${pH.toFixed(2)}`,
        },
      ],
      keyConcept: {
        title: 'Why pH ≠ 7 at Equivalence?',
        explanation:
          'The equivalence point of a weak acid-strong base titration is BASIC (pH > 7) because the conjugate base (acetate) hydrolyzes to produce OH⁻ ions. Only strong acid-strong base titrations have pH = 7 at equivalence.',
      },
    };
  }

  // Beyond equivalence
  if (stage === 'beyond') {
    const excessMoles = molesBase - molesAcid;
    const excessConc = excessMoles / totalVolume;
    const pOH = -Math.log10(excessConc);

    return {
      isKeyPoint: isKeyPoint,
      keyPointLabel,
      steps: [
        {
          step: 1,
          title: 'Calculate total base added',
          explanation: 'Find total moles of NaOH',
          calculation: `n(NaOH) = ${(volumeNaOH / 1000).toFixed(5)} L × 0.100 M = ${molesBase.toFixed(5)} mol`,
          result: `${molesBase.toFixed(5)} mol NaOH added`,
        },
        {
          step: 2,
          title: 'Calculate excess base',
          explanation: 'Subtract moles used for neutralization',
          calculation: `Excess = n(NaOH) - n(CH₃COOH)\nExcess = ${molesBase.toFixed(5)} - ${molesAcid.toFixed(5)} mol`,
          result: `${excessMoles.toFixed(5)} mol excess OH⁻`,
        },
        {
          step: 3,
          title: 'Calculate [OH⁻]',
          explanation: 'Use new total volume',
          calculation: `[OH⁻] = ${excessMoles.toFixed(5)} mol / ${(totalVolume).toFixed(5)} L`,
          result: `[OH⁻] = ${excessConc.toFixed(4)} M`,
        },
        {
          step: 4,
          title: 'Calculate pOH',
          explanation: 'Use pOH = -log[OH⁻]',
          calculation: `pOH = -log(${excessConc.toFixed(4)})`,
          result: `pOH = ${pOH.toFixed(2)}`,
        },
        {
          step: 5,
          title: 'Calculate pH',
          explanation: 'Use pH + pOH = 14',
          calculation: `pH = 14 - ${pOH.toFixed(2)}`,
          result: `pH = ${pH.toFixed(2)}`,
        },
      ],
      keyConcept: {
        title: 'Excess Strong Base Dominates',
        explanation:
          'After equivalence, the pH is controlled by the excess strong base (NaOH), not the buffer. The calculation becomes a simple strong base pH calculation.',
      },
    };
  }

  // Fallback for other cases
  return {
    isKeyPoint: false,
    steps: [],
  };
}