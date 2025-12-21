import { VisualizationStep } from "@/types/algorithm";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface MergePatternVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

interface MergeHistoryItem {
  first: number;
  second: number;
  result: number;
  cost: number;
}

export function MergePatternVisualizer({
  currentStep,
  className,
}: MergePatternVisualizerProps) {
  const payload = currentStep?.payload || {};
  const heap: number[] = (payload.heap as number[]) || [];
  const totalCost = (payload.totalCost as number) || 0;
  const mergeHistory: MergeHistoryItem[] =
    (payload.mergeHistory as MergeHistoryItem[]) || [];
  const selected: number[] = (payload.selected as number[]) || [];
  const mergeCost = payload.mergeCost as number | undefined;
  const kind = currentStep?.kind || 'init';

  // Calculate max size for scaling bars
  const maxSize = useMemo(() => Math.max(...heap, 1), [heap]);

  // Determine which indices are selected (first two in heap during select phase)
  const selectedIndices = useMemo(() => {
    if (kind === 'select' && selected.length === 2) {
      return [0, 1]; // First two elements in min-heap are always smallest
    }
    return [];
  }, [kind, selected]);

  return (
    <div className={cn("glass-panel p-4 overflow-hidden", className)}>
      {/* Header with Total Cost */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          Optimal Merge Pattern
        </h3>
        <div className="flex gap-4 text-xs">
          <span className="text-muted-foreground">
            Total Cost:{" "}
            <span className="text-success font-mono font-bold text-base">{totalCost}</span>
          </span>
        </div>
      </div>

      {/* Priority Queue (Min-Heap) Visualization */}
      <div className="mb-6">
        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
          <span>Min-Heap</span>
          <span className="text-muted-foreground/50">({heap.length} elements)</span>
        </div>

        <div className="flex items-end gap-2 h-36 p-3 bg-panel rounded-lg border border-panel-border">
          {heap.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Heap is empty - All files merged!
            </div>
          ) : (
            heap.map((size, idx) => {
              const heightPercent = (size / maxSize) * 100;
              const isSelected = selectedIndices.includes(idx);
              const isNewlyMerged = kind === 'merge' && idx === heap.length; // Won't match since heap already updated
              
              return (
                <div
                  key={`${idx}-${size}`}
                  className="flex flex-col items-center gap-1 flex-1 max-w-20 transition-all duration-500"
                  style={{
                    animation: kind === 'insert' && idx === heap.findIndex(h => h === (payload.mergeCost as number)) 
                      ? 'fade-in 0.3s ease-out' 
                      : undefined
                  }}
                >
                  {/* Value label on top */}
                  <span className={cn(
                    "text-xs font-mono font-bold transition-all duration-300",
                    isSelected ? "text-primary scale-110" : "text-foreground"
                  )}>
                    {size}
                  </span>
                  
                  {/* Bar */}
                  <div
                    className={cn(
                      "w-full rounded-t transition-all duration-500 relative",
                      isSelected 
                        ? "bg-primary shadow-lg shadow-primary/30" 
                        : isNewlyMerged
                        ? "bg-success shadow-lg shadow-success/30"
                        : "bg-secondary/60"
                    )}
                    style={{
                      height: `${Math.max(heightPercent, 15)}%`,
                      minHeight: '24px',
                    }}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  {/* Index label */}
                  <span className="text-xs text-muted-foreground">{idx + 1}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Current merge operation display */}
        {kind === 'select' && selected.length === 2 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm animate-fade-in">
            <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg font-mono font-bold">
              {selected[0]}
            </span>
            <span className="text-muted-foreground">+</span>
            <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg font-mono font-bold">
              {selected[1]}
            </span>
            <span className="text-muted-foreground">=</span>
            <span className="px-3 py-1.5 bg-secondary/20 text-secondary rounded-lg font-mono font-bold">
              {selected[0] + selected[1]}
            </span>
          </div>
        )}

        {kind === 'merge' && mergeCost !== undefined && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm animate-fade-in">
            <span className="text-success font-medium">
              Merged! Cost added: <span className="font-mono font-bold">+{mergeCost}</span>
            </span>
          </div>
        )}
      </div>

      {/* Merge History */}
      <div>
        <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
          <span>Merge History</span>
          {mergeHistory.length > 0 && (
            <span className="text-muted-foreground/50">{mergeHistory.length} merges</span>
          )}
        </div>
        
        <div className="space-y-1.5 max-h-28 overflow-y-auto scrollbar-thin">
          {mergeHistory.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 text-center bg-panel rounded">
              No merges yet - waiting to start
            </div>
          ) : (
            mergeHistory.map((merge, idx) => {
              const isLatest = idx === mergeHistory.length - 1;
              
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-2 text-xs p-2 rounded transition-all duration-300",
                    isLatest 
                      ? "bg-secondary/20 border border-secondary/30" 
                      : "bg-panel"
                  )}
                  style={{
                    animation: isLatest ? 'fade-in 0.3s ease-out' : undefined
                  }}
                >
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                    isLatest ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </span>
                  <span className="font-mono">{merge.first}</span>
                  <span className="text-muted-foreground">+</span>
                  <span className="font-mono">{merge.second}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-mono text-primary font-bold">{merge.result}</span>
                  <span className="ml-auto text-success font-mono">
                    +{merge.cost}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Completion state */}
      {kind === 'complete' && (
        <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded-lg text-center animate-fade-in">
          <p className="text-success font-medium">
            ✓ All files merged! Total cost: <span className="font-mono font-bold">{totalCost}</span>
          </p>
        </div>
      )}
    </div>
  );
}
