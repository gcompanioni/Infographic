import styles from './Flask.module.css';

interface FlaskProps {
  solutionColor: string;
  volumeInFlask: number; // Total volume in mL
  className?: string;
}

export const Flask = ({ solutionColor, volumeInFlask, className }: FlaskProps) => {
  const maxDisplayVolume = 60; // mL for visual purposes
  const fillPercentage = Math.min((volumeInFlask / maxDisplayVolume) * 100, 90);

  return (
    <div className={`${styles.flask} ${className || ''}`}>
      <div className={styles.neck}></div>
      <div className={styles.body}>
        <div 
          className={styles.solution}
          style={{ 
            height: `${fillPercentage}%`,
            backgroundColor: solutionColor || 'rgba(200, 220, 255, 0.3)',
          }}
        ></div>
        {/* Visual shine effect */}
        <div className={styles.shine}></div>
      </div>
    </div>
  );
};