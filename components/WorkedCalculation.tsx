import { Badge } from './Badge';
import { BookOpen, Calculator } from 'lucide-react';
import { WorkedSolution } from '../helpers/calculationSteps';
import styles from './WorkedCalculation.module.css';

interface Props {
  solution: WorkedSolution;
  className?: string;
}

export const WorkedCalculation = ({ solution, className }: Props) => {

  if (!solution.steps || solution.steps.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      

      <div className={styles.header}>
        <h2 className={styles.title}>
          <Calculator size={20} />
          Step-by-Step Calculation
        </h2>
      </div>

      <div className={styles.steps}>
        {solution.steps.map((step) => (
          <div key={step.step} className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>Step {step.step}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
            </div>
            <p className={styles.stepExplanation}>{step.explanation}</p>
            <div className={styles.calculation}>
              <pre className={styles.calculationText}>{step.calculation}</pre>
            </div>
            <div className={styles.result}>
              <span className={styles.resultLabel}>Result:</span>
              <span className={styles.resultValue}>{step.result}</span>
            </div>
          </div>
        ))}
      </div>

      {solution.keyConcept && (
        <div className={styles.keyConcept}>
          <div className={styles.keyConceptHeader}>
            <BookOpen size={18} />
            <h3 className={styles.keyConceptTitle}>{solution.keyConcept.title}</h3>
          </div>
          <p className={styles.keyConceptText}>{solution.keyConcept.explanation}</p>
        </div>
      )}
    </div>
  );
};