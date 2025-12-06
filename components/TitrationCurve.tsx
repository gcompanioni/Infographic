import { useMemo } from 'react';
import { calculatePH } from '../helpers/titrationChemistry';
import styles from './TitrationCurve.module.css';

interface Props {
  currentVolume: number;
  currentPH: number;
  className?: string;
}

export const TitrationCurve = ({ currentVolume, currentPH, className }: Props) => {
  // Generate curve data points
  const curveData = useMemo(() => {
    const points: Array<{ volume: number; pH: number }> = [];
    
    // More points near equivalence for better curve
    for (let v = 0; v <= 40; v += 0.5) {
      points.push({ volume: v, pH: calculatePH(v) });
    }
    
    return points;
  }, []);

  // SVG dimensions
  const width = 500;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = (volume: number) => margin.left + (volume / 40) * plotWidth;
  const yScale = (pH: number) => margin.top + plotHeight - ((pH / 14) * plotHeight);

  // Generate path for curve
  const curvePath = useMemo(() => {
    const pathData = curveData.map((point, i) => {
      const x = xScale(point.volume);
      const y = yScale(point.pH);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
    
    return pathData;
  }, [curveData]);

  // Key points to highlight
  const keyPoints = [
    { volume: 0, label: 'Initial', color: 'var(--error)' },
    { volume: 12.5, label: 'Half-Eq', color: 'var(--warning)' },
    { volume: 25, label: 'Equivalence', color: 'var(--success)' },
    { volume: 30, label: 'Beyond', color: 'var(--info)' },
  ];

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h3 className={styles.title}>Titration Curve</h3>
      <svg width={width} height={height} className={styles.svg}>
        {/* Grid lines */}
        {[0, 2, 4, 6, 7, 8, 10, 12, 14].map((pH) => (
          <g key={`grid-${pH}`}>
            <line
              x1={margin.left}
              y1={yScale(pH)}
              x2={width - margin.right}
              y2={yScale(pH)}
              stroke={pH === 7 ? 'var(--primary)' : 'var(--border)'}
              strokeWidth={pH === 7 ? 1.5 : 0.5}
              strokeDasharray={pH === 7 ? '5,5' : 'none'}
            />
            <text
              x={margin.left - 10}
              y={yScale(pH)}
              textAnchor="end"
              alignmentBaseline="middle"
              className={styles.axisLabel}
            >
              {pH}
            </text>
          </g>
        ))}

        {/* Vertical grid lines */}
        {[0, 10, 20, 25, 30, 40].map((volume) => (
          <g key={`vgrid-${volume}`}>
            <line
              x1={xScale(volume)}
              y1={margin.top}
              x2={xScale(volume)}
              y2={height - margin.bottom}
              stroke={volume === 25 ? 'var(--success)' : 'var(--border)'}
              strokeWidth={volume === 25 ? 1.5 : 0.5}
              strokeDasharray={volume === 25 ? '5,5' : 'none'}
            />
            <text
              x={xScale(volume)}
              y={height - margin.bottom + 20}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {volume}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="var(--foreground)"
          strokeWidth={2}
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="var(--foreground)"
          strokeWidth={2}
        />

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          className={styles.axisTitle}
        >
          Volume of NaOH Added (mL)
        </text>
        <text
          x={-height / 2}
          y={15}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${height / 2})`}
          className={styles.axisTitle}
        >
          pH
        </text>

        {/* Titration curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={3}
          className={styles.curve}
        />

        {/* Key points */}
        {keyPoints.map((point) => {
          const pH = calculatePH(point.volume);
          return (
            <g key={point.volume}>
              <circle
                cx={xScale(point.volume)}
                cy={yScale(pH)}
                r={6}
                fill={point.color}
                stroke="var(--card)"
                strokeWidth={2}
              />
              <text
                x={xScale(point.volume)}
                y={yScale(pH) - 15}
                textAnchor="middle"
                className={styles.keyPointLabel}
                fill={point.color}
              >
                {point.label}
              </text>
            </g>
          );
        })}

        {/* Current position indicator */}
        <g className={styles.currentIndicator}>
          <line
            x1={xScale(currentVolume)}
            y1={margin.top}
            x2={xScale(currentVolume)}
            y2={height - margin.bottom}
            stroke="var(--accent)"
            strokeWidth={2}
            strokeDasharray="4,4"
          />
          <circle
            cx={xScale(currentVolume)}
            cy={yScale(currentPH)}
            r={8}
            fill="var(--accent)"
            stroke="var(--card)"
            strokeWidth={3}
          />
          <text
            x={xScale(currentVolume)}
            y={margin.top - 5}
            textAnchor="middle"
            className={styles.currentLabel}
          >
                        You Are Here
          </text>
        </g>
      </svg>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: 'var(--accent)' }} />
          <span>Current Position</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: 'var(--success)' }} />
          <span>Equivalence Point (25 mL)</span>
        </div>
      </div>
    </div>
  );
};