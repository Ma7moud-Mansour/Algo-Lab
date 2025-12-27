import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { VisualizationStep } from '@/types/algorithm';

interface ArrayVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

export function ArrayVisualizer({ currentStep, className }: ArrayVisualizerProps) {
  const { array, compareIndices, swapIndices, sortedIndices, pivotIndex, foundIndex, searchRange } = useMemo(() => {
    if (!currentStep) {
      return { 
        array: [] as number[], 
        compareIndices: [] as number[], 
        swapIndices: [] as number[],
        sortedIndices: [] as number[],
        pivotIndex: -1,
        foundIndex: -1,
        searchRange: { left: -1, right: -1, mid: -1 },
      };
    }

    const payload = currentStep.payload as Record<string, unknown>;
    const arr = (payload.array as number[]) || [];
    
    let compare: number[] = [];
    let swap: number[] = [];
    let sorted: number[] = [];
    let pivot = -1;
    let found = -1;
    let range = { left: -1, right: -1, mid: -1 };

    if (currentStep.kind === 'compare') {
      compare = (payload.indices as number[]) || [];
    } else if (currentStep.kind === 'swap' || currentStep.kind === 'after-swap') {
      swap = (payload.indices as number[]) || [];
    } else if (currentStep.kind === 'sorted') {
      sorted = [(payload.index as number)];
    } else if (currentStep.kind === 'pivot-select' || currentStep.kind === 'pivot-placed') {
      pivot = (payload.pivotIndex as number) ?? -1;
    } else if (currentStep.kind === 'found') {
      found = (payload.index as number) ?? -1;
    } else if (currentStep.kind === 'calculate-mid') {
      range = {
        left: (payload.left as number) ?? -1,
        right: (payload.right as number) ?? -1,
        mid: (payload.mid as number) ?? -1,
      };
    } else if (currentStep.kind === 'search-left' || currentStep.kind === 'search-right' || currentStep.kind === 'update-bounds') {
      range = {
        left: (payload.left as number) ?? -1,
        right: (payload.right as number) ?? -1,
        mid: -1,
      };
    }

    return { 
      array: arr, 
      compareIndices: compare, 
      swapIndices: swap,
      sortedIndices: sorted,
      pivotIndex: pivot,
      foundIndex: found,
      searchRange: range,
    };
  }, [currentStep]);

  const maxValue = useMemo(() => {
    if (array.length === 0) return 100;
    return Math.max(...array);
  }, [array]);

  // Calculate min value to handle negative numbers
  const minValue = useMemo(() => {
    if (array.length === 0) return 0;
    return Math.min(...array);
  }, [array]);

  // Calculate the range for proper scaling
  const valueRange = useMemo(() => {
    return maxValue - Math.min(minValue, 0);
  }, [maxValue, minValue]);

  if (array.length === 0) {
    return (
      <div className={cn('glass-panel flex items-center justify-center', className)}>
        <p className="text-muted-foreground">No data to visualize</p>
      </div>
    );
  }

  return (
    <div className={cn('glass-panel p-6', className)}>
      <div className="h-full flex items-end justify-center gap-1 md:gap-2">
        {array.map((value, index) => {
          // Calculate height as percentage of the range, ensuring minimum visibility
          const normalizedValue = value - Math.min(minValue, 0);
          const heightPercent = valueRange > 0 ? (normalizedValue / valueRange) * 100 : 50;
          
          const isComparing = compareIndices.includes(index);
          const isSwapping = swapIndices.includes(index);
          const isSorted = sortedIndices.includes(index);
          const isPivot = pivotIndex === index;
          const isFound = foundIndex === index;
          const isInRange = searchRange.left <= index && index <= searchRange.right && searchRange.left !== -1;
          const isMid = searchRange.mid === index;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 flex-1 max-w-16"
              style={{ height: '100%' }}
            >
              <div className="flex-1 w-full flex items-end justify-center">
                <div
                  className={cn(
                    'w-full rounded-t-md transition-all duration-300 relative',
                    isFound && 'bg-success glow-secondary animate-pulse',
                    isMid && 'bg-info glow-secondary',
                    isComparing && !isMid && 'bg-secondary glow-secondary',
                    isSwapping && 'bg-primary glow-primary animate-pulse',
                    isSorted && 'bg-success',
                    isPivot && 'bg-secondary glow-secondary',
                    isInRange && !isMid && !isFound && 'bg-accent',
                    !isComparing && !isSwapping && !isSorted && !isPivot && !isInRange && !isMid && !isFound && 'bg-muted'
                  )}
                  style={{ 
                    height: `${Math.max(heightPercent, 8)}%`,
                    minHeight: '16px',
                  }}
                >
                  {(isComparing || isSwapping || isPivot || isMid || isFound) && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <span className={cn(
                        'text-xs font-bold px-1.5 py-0.5 rounded',
                        isFound && 'bg-success text-success-foreground',
                        isMid && !isFound && 'bg-info text-foreground',
                        isPivot && 'bg-secondary text-secondary-foreground',
                        isSwapping && 'bg-primary text-primary-foreground',
                        isComparing && !isMid && 'bg-secondary/80 text-secondary-foreground'
                      )}>
                        {isFound ? '✓' : isMid ? 'mid' : isPivot ? 'P' : isSwapping ? '↔' : '⟷'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span className={cn(
                'text-xs font-mono transition-colors flex-shrink-0',
                (isComparing || isSwapping || isMid || isFound) ? 'text-foreground font-bold' : 'text-muted-foreground'
              )}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
