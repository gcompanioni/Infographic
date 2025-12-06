import styles from './Burette.module.css';

interface BuretteProps {
  volumeRemaining: number; // mL remaining in burette
  isAnimating: boolean;
  className?: string;
}

export const Burette = ({ volumeRemaining, isAnimating, className }: BuretteProps) => {
  const maxVolume = 50; // mL
  const fillPercentage = (volumeRemaining / maxVolume) * 100;

  return (
    <div className={`${styles.burette} ${className || ''}`}>
      <div className={styles.stopcock}></div>
      <div className={styles.tube}>
        {/* Volume markings */}
        {[0, 10, 20, 30, 40, 50].map((mark) => (
          <div
            key={mark}
            className={styles.marking}
            style={{ bottom: `${(mark / maxVolume) * 100}%` }}
          >
            <span className={styles.markingLabel}>{50 - mark}</span>
            <div className={styles.markingLine}></div>
          </div>
        ))}
        
        {/* Liquid in burette */}
        <div 
          className={styles.liquid}
          style={{ height: `${fillPercentage}%` }}
        ></div>

        {/* Dropping animation */}
        {isAnimating && (
          <div className={styles.droplet}></div>
        )}
      </div>
      <div className={styles.tip}></div>
    </div>
  );
};