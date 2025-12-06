import { AlertTriangle, Lightbulb } from 'lucide-react';
import styles from './TipsPanel.module.css';

interface Props {
  className?: string;
}

export const TipsPanel = ({ className }: Props) => {
  const mistakes = [
    'Forgetting to account for volume change when calculating concentrations',
    'Using wrong equation for each region (weak acid vs buffer vs strong base)',
    'Confusing Ka with Kb at equivalence point',
    'Not recognizing buffer region vs steep region transitions',
    'Forgetting that weak acid-strong base equivalence point is basic (pH > 7)',
  ];

  const tips = [
    'Always start by calculating moles, not concentrations',
    'Draw an ICE table for equilibrium problems',
    'Check if you\'re before, at, or after equivalence point first',
    'At half-equivalence, pH = pKa (useful shortcut!)',
    'Buffer capacity is highest when [HA] = [A⁻]',
    'Remember: equivalence point pH depends on the type of titration',
  ];

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <AlertTriangle size={20} />
          <h3 className={styles.sectionTitle}>Common Mistakes</h3>
        </div>
        <ul className={styles.list}>
          {mistakes.map((mistake, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.bullet}>✗</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Lightbulb size={20} />
          <h3 className={styles.sectionTitle}>Tips for Success</h3>
        </div>
        <ul className={styles.list}>
          {tips.map((tip, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.bulletSuccess}>✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};