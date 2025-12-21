import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ExecutionState, ExecutionSpeed } from '@/types/algorithm';

interface ControlPanelProps {
  executionState: ExecutionState;
  speed: ExecutionSpeed;
  progress: number;
  currentStepIndex?: number;
  totalSteps?: number;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onStepBack?: () => void;
  onReset: () => void;
  onSpeedChange: (speed: ExecutionSpeed) => void;
  onGoToStep?: (index: number) => void;
  className?: string;
}

const speedLabels: Record<ExecutionSpeed, string> = {
  slow: 'Slow',
  normal: 'Normal',
  fast: 'Fast',
};

const speedValues: ExecutionSpeed[] = ['slow', 'normal', 'fast'];

export function ControlPanel({
  executionState,
  speed,
  progress,
  currentStepIndex = -1,
  totalSteps = 0,
  onRun,
  onPause,
  onStep,
  onStepBack,
  onReset,
  onSpeedChange,
  onGoToStep,
  className,
}: ControlPanelProps) {
  const isRunning = executionState === 'running';
  const isCompleted = executionState === 'completed';
  const canStepBack = currentStepIndex >= 0 && !isRunning;
  const canStepForward = currentStepIndex < totalSteps - 1 && !isRunning;

  const handleSpeedSliderChange = (value: number[]) => {
    onSpeedChange(speedValues[value[0]]);
  };

  const handleProgressSliderChange = (value: number[]) => {
    if (onGoToStep && totalSteps > 0) {
      const stepIndex = Math.round((value[0] / 100) * (totalSteps - 1));
      onGoToStep(stepIndex);
    }
  };

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex flex-col gap-4">
        {/* Progress slider - clickable and draggable */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStepIndex + 1} / {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Slider
            value={[progress]}
            onValueChange={handleProgressSliderChange}
            max={100}
            step={totalSteps > 0 ? 100 / totalSteps : 1}
            disabled={isRunning || totalSteps === 0}
            className="cursor-pointer"
          />
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="h-10 w-10 border-panel-border hover:border-primary hover:text-primary"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          {/* Step Back Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onStepBack}
            disabled={!canStepBack}
            className="h-10 w-10 border-panel-border hover:border-info hover:text-info"
            title="Step Back"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            onClick={isRunning ? onPause : onRun}
            disabled={isCompleted}
            className={cn(
              'h-12 w-12 rounded-full',
              isRunning 
                ? 'bg-secondary hover:bg-secondary/90' 
                : 'bg-primary hover:bg-primary/90 glow-primary'
            )}
            title={isRunning ? 'Pause' : 'Run'}
          >
            {isRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          {/* Step Forward Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onStep}
            disabled={!canStepForward}
            className="h-10 w-10 border-panel-border hover:border-secondary hover:text-secondary"
            title="Step Forward"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground w-12">Speed:</span>
          <Slider
            value={[speedValues.indexOf(speed)]}
            onValueChange={handleSpeedSliderChange}
            max={2}
            step={1}
            className="flex-1"
          />
          <span className="text-xs font-medium text-foreground w-14 text-right">
            {speedLabels[speed]}
          </span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            executionState === 'idle' && 'bg-muted-foreground',
            executionState === 'running' && 'bg-success animate-pulse',
            executionState === 'paused' && 'bg-secondary',
            executionState === 'completed' && 'bg-primary'
          )} />
          <span className="text-xs text-muted-foreground capitalize">
            {executionState}
          </span>
        </div>
      </div>
    </div>
  );
}
