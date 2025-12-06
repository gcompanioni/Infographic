import styles from './ProblemStatement.module.css';

interface Props {
  className?: string;
}

export const ProblemStatement = ({ className }: Props) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h2 className={styles.title}>Problem Statement</h2>
      
      <div className={styles.preCalculation}>
        <h3 className={styles.subtitle}>Step 1: Determine Equivalence Volume</h3>
        <p className={styles.calcText}>Using M₁V₁ = M₂V₂:</p>
        <div className={styles.equation}>
          (0.120 M)(25.0 mL) = (0.100 M)(V₂)
        </div>
        <div className={styles.result}>
          V₂ = 30.0 mL
        </div>
      </div>

      <div className={styles.problem}>
        <p className={styles.problemText}>
          Calculate the pH when <strong>0.0 mL</strong>, <strong>15.0 mL</strong>, 
          <strong> 30.0 mL</strong>, and <strong>36.0 mL</strong> of <strong>0.100 M NaOH</strong> is 
          added to <strong>25.0 mL</strong> of <strong>0.120 M acetic acid</strong> (CH₃COOH, 
          K<sub>a</sub> = 1.8 × 10<sup>-5</sup>)
        </p>
      </div>
      
    </div>
  );
};