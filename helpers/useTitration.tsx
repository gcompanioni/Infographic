import { useReducer, useCallback } from 'react';
import { calculatePH, determineTitrationStage, getSolutionColor, TITRATION_CONSTANTS } from './titrationChemistry';

type TitrationState = {
  volumeAdded: number; // mL of NaOH added
  pH: number;
  isAnimating: boolean; // true when liquid is dropping
};

type TitrationAction =
  | { type: 'ADD_BASE'; payload: number }
  | { type: 'START_ANIMATION' }
  | { type: 'STOP_ANIMATION' }
  | { type: 'RESET' };

const initialState: TitrationState = {
  volumeAdded: 0,
  pH: 2.87, // Initial pH of 0.100 M acetic acid
  isAnimating: false,
};

function titrationReducer(state: TitrationState, action: TitrationAction): TitrationState {
  switch (action.type) {
    case 'ADD_BASE': {
      const newVolume = Math.round((state.volumeAdded + action.payload) * 10) / 10; // Round to 1 decimal
      const newPH = calculatePH(newVolume);
      return {
        ...state,
        volumeAdded: newVolume,
        pH: newPH,
      };
    }
    case 'START_ANIMATION':
      return { ...state, isAnimating: true };
    case 'STOP_ANIMATION':
      return { ...state, isAnimating: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useTitration() {
  const [state, dispatch] = useReducer(titrationReducer, initialState);

  const addBase = useCallback((volume: number) => {
    dispatch({ type: 'START_ANIMATION' });
    // Simulate animation delay
    setTimeout(() => {
      dispatch({ type: 'ADD_BASE', payload: volume });
      dispatch({ type: 'STOP_ANIMATION' });
    }, 500);
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const stageInfo = determineTitrationStage(state.volumeAdded);
  const solutionColor = getSolutionColor(state.pH);
  const volumeRemaining = Math.max(0, 50 - state.volumeAdded); // Burette capacity 50 mL

  return {
    volumeAdded: state.volumeAdded,
    pH: state.pH,
    isAnimating: state.isAnimating,
    stageInfo,
    solutionColor,
    volumeRemaining,
    constants: TITRATION_CONSTANTS,
    addBase,
    reset,
  };
}