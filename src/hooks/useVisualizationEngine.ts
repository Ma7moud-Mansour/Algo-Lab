import { useState, useCallback, useRef, useEffect } from 'react';
import { VisualizationStep, ExecutionState, ExecutionSpeed } from '@/types/algorithm';

interface UseVisualizationEngineProps {
  steps: VisualizationStep[];
  onStepChange?: (step: VisualizationStep, index: number) => void;
}

interface UseVisualizationEngineReturn {
  currentStepIndex: number;
  currentStep: VisualizationStep | null;
  executionState: ExecutionState;
  speed: ExecutionSpeed;
  logs: string[];
  run: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (speed: ExecutionSpeed) => void;
  progress: number;
}

const SPEED_DELAYS: Record<ExecutionSpeed, number> = {
  slow: 1500,
  normal: 800,
  fast: 300,
};

export function useVisualizationEngine({
  steps,
  onStepChange,
}: UseVisualizationEngineProps): UseVisualizationEngineReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [executionState, setExecutionState] = useState<ExecutionState>('idle');
  const [speed, setSpeed] = useState<ExecutionSpeed>('normal');
  const [logs, setLogs] = useState<string[]>([]);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepsRef = useRef(steps);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const executeStep = useCallback((index: number) => {
    if (index >= stepsRef.current.length) {
      setExecutionState('completed');
      addLog('Execution completed!');
      return;
    }

    const step = stepsRef.current[index];
    setCurrentStepIndex(index);
    
    if (step.description) {
      addLog(step.description);
    }

    onStepChange?.(step, index);
  }, [onStepChange, addLog]);

  const scheduleNextStep = useCallback(() => {
    const currentIndex = currentStepIndex;
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= stepsRef.current.length) {
      setExecutionState('completed');
      addLog('Execution completed!');
      return;
    }

    const delay = stepsRef.current[currentIndex]?.delayMs || SPEED_DELAYS[speed];
    
    timeoutRef.current = setTimeout(() => {
      executeStep(nextIndex);
      if (executionState === 'running') {
        scheduleNextStep();
      }
    }, delay);
  }, [currentStepIndex, speed, executeStep, executionState, addLog]);

  const run = useCallback(() => {
    if (stepsRef.current.length === 0) return;
    
    clearTimer();
    setExecutionState('running');
    
    if (currentStepIndex < 0) {
      executeStep(0);
      addLog('Starting execution...');
    }
    
    const runLoop = (index: number) => {
      if (index >= stepsRef.current.length) {
        setExecutionState('completed');
        addLog('Execution completed!');
        return;
      }

      const step = stepsRef.current[index];
      setCurrentStepIndex(index);
      
      if (step.description) {
        addLog(step.description);
      }
      onStepChange?.(step, index);

      const delay = step.delayMs || SPEED_DELAYS[speed];
      
      timeoutRef.current = setTimeout(() => {
        runLoop(index + 1);
      }, delay);
    };

    const startIndex = currentStepIndex < 0 ? 0 : currentStepIndex + 1;
    
    if (currentStepIndex >= 0) {
      const delay = SPEED_DELAYS[speed];
      timeoutRef.current = setTimeout(() => {
        runLoop(startIndex);
      }, delay);
    } else {
      runLoop(startIndex);
    }
  }, [currentStepIndex, speed, executeStep, clearTimer, onStepChange, addLog]);

  const pause = useCallback(() => {
    clearTimer();
    setExecutionState('paused');
    addLog('Execution paused');
  }, [clearTimer, addLog]);

  const step = useCallback(() => {
    if (stepsRef.current.length === 0) return;
    
    clearTimer();
    setExecutionState('paused');
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepsRef.current.length) {
      executeStep(nextIndex);
    } else if (currentStepIndex === -1 && stepsRef.current.length > 0) {
      executeStep(0);
      addLog('Stepping through execution...');
    }
  }, [currentStepIndex, executeStep, clearTimer, addLog]);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStepIndex(-1);
    setExecutionState('idle');
    setLogs([]);
    addLog('Visualization reset');
  }, [clearTimer, addLog]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  useEffect(() => {
    reset();
  }, [steps]);

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length 
    ? steps[currentStepIndex] 
    : null;

  const progress = steps.length > 0 
    ? ((currentStepIndex + 1) / steps.length) * 100 
    : 0;

  return {
    currentStepIndex,
    currentStep,
    executionState,
    speed,
    logs,
    run,
    pause,
    step,
    reset,
    setSpeed,
    progress,
  };
}
