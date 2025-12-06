import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Separator } from '../components/Separator';
import { ProblemStatement } from '../components/ProblemStatement';
import { TipsPanel } from '../components/TipsPanel';
import { WorkedCalculation } from '../components/WorkedCalculation';
import { TitrationCurve } from '../components/TitrationCurve';
import { RotateCcw, Zap } from 'lucide-react';
import { useTitration } from '../helpers/useTitration';
import { getWorkedSolution } from '../helpers/calculationSteps';
import { Burette } from '../components/Burette';
import { Flask } from '../components/Flask';
import styles from './_index.module.css';

export default function IndexPage() {
  const {
    volumeAdded,
    pH,
    isAnimating,
    stageInfo,
    solutionColor,
    volumeRemaining,
    constants,
    addBase,
    reset,
  } = useTitration();

  const totalVolume = constants.acidVolume + volumeAdded;
  const workedSolution = getWorkedSolution(volumeAdded, stageInfo.stage, pH);

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Rick's Interdimensional Titration Lab | Wubba Lubba Dub Dub!</title>
      </Helmet>

      <div className={styles.headerSection}>
        <h1 className={styles.title}>Rick's Interdimensional Titration Lab</h1>
        <p className={styles.subtitle}>
          "Listen, Morty! We gotta neutralize this acid before the Galactic Federation finds us! *burp*"
        </p>
        <p className={styles.credits}>
          Lab Assistants: Giancarlo Companioni, Andro Romero, Humberto Corrales
        </p>
      </div>

      <div className={styles.problemSection}>
        <ProblemStatement className={styles.rickProblem} />
      </div>

      <div className={styles.tipsSection}>
        <TipsPanel className={styles.rickTips} />
      </div>

      <div className={styles.mainContent}>
        {/* Left Column: Apparatus + Curve */}
        <div className={styles.leftColumn}>
          <div className={styles.apparatus}>
            <div className={styles.portalGlow}></div>
            <Burette 
              volumeRemaining={volumeRemaining}
              isAnimating={isAnimating}
              className={styles.rickBurette}
            />
            <Flask 
              solutionColor={solutionColor}
              volumeInFlask={totalVolume}
              className={styles.rickFlask}
            />
          </div>

          <div className={styles.curveContainer}>
             <TitrationCurve currentVolume={volumeAdded} currentPH={pH} />
          </div>
        </div>

        {/* Center Column: Controls + Stage Info */}
        <div className={styles.centerColumn}>
          <div className={styles.controlPanel}>
            <h2 className={styles.controlTitle}>Portal Gun Controls</h2>
            
            <div className={styles.displaySection}>
              <div className={styles.phDisplay}>
                <div className={styles.displayLabel}>pH Level</div>
                <div className={styles.displayValue}>{pH.toFixed(2)}</div>
              </div>
              <div className={styles.volumeDisplay}>
                <div className={styles.displayLabel}>Juice Added</div>
                <div className={styles.displayValue}>{volumeAdded.toFixed(1)} mL</div>
              </div>
            </div>

            <Separator className={styles.neonSeparator} />

            <div className={styles.buttonSection}>
              <Button 
                onClick={() => addBase(1)} 
                disabled={isAnimating || volumeRemaining < 1}
                size="lg"
                className={styles.rickButton}
              >
                Squirt 1 mL
              </Button>
              <Button 
                onClick={() => addBase(5)} 
                disabled={isAnimating || volumeRemaining < 5}
                size="lg"
                className={styles.rickButton}
              >
                Blast 5 mL
              </Button>
              <Button 
                onClick={() => addBase(10)} 
                disabled={isAnimating || volumeRemaining < 10}
                size="lg"
                className={styles.rickButton}
              >
                Dump 10 mL
              </Button>
            </div>

            <Button 
              onClick={reset}
              variant="outline"
              size="lg"
              className={styles.resetButton}
            >
              <RotateCcw className="mr-2" /> Reset Timeline
            </Button>
          </div>

          <div className={styles.infoPanel}>
            <div className={styles.stageHeader}>
              <div className={styles.badgeWrapper}>
                <Badge 
                  variant={
                    stageInfo.stage === 'equivalence' ? 'success' : 
                    stageInfo.stage === 'beyond' ? 'warning' : 
                    'default'
                  }
                  className={styles.rickBadge}
                >
                  {stageInfo.stage.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <h2 className={styles.stageTitle}>{stageInfo.title}</h2>
            </div>

            <div className={styles.infoContent}>
              <div className={styles.infoItem}>
                <h3 className={styles.infoLabel}><Zap size={14} /> Description</h3>
                <p className={styles.infoText}>{stageInfo.description}</p>
              </div>

              <div className={styles.infoItem}>
                <h3 className={styles.infoLabel}><Zap size={14} /> Dominant Species</h3>
                <p className={styles.infoText}>{stageInfo.dominantSpecies}</p>
              </div>

              <div className={styles.infoItem}>
                <h3 className={styles.infoLabel}><Zap size={14} /> Relevant Equation</h3>
                <p className={styles.infoEquation}>{stageInfo.relevantEquation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations */}
        <div className={styles.rightColumn}>
          <div className={styles.calcWrapper}>
            <WorkedCalculation solution={workedSolution} />
          </div>
        </div>
      </div>
    </div>
  );
}