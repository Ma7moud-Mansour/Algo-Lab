import { VisualizationStep } from "@/types/algorithm";
import { cn } from "@/lib/utils";

interface MergePatternVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

interface NodeState {
  id: number;
  size: number;
  merged: boolean;
  active: boolean;
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
  const nodes: NodeState[] = (payload.nodes as NodeState[]) || [];
  const totalCost = (payload.totalCost as number) || 0;
  const mergeHistory: MergeHistoryItem[] =
    (payload.mergeHistory as MergeHistoryItem[]) || [];
  const selected: number[] = (payload.selected as number[]) || [];
  const mergeCost = payload.mergeCost as number | undefined;

  const activeNodes = nodes.filter((n) => !n.merged);

  // ✅ لازم maxSize يتحسب من heap نفسها
  const maxSize = Math.max(...heap, 1);

  return (
    <div className={cn("glass-panel p-4 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          Optimal Merge Pattern
        </h3>
        <div className="flex gap-4 text-xs">
          <span className="text-muted-foreground">
            Total Cost:{" "}
            <span className="text-success font-mono">{totalCost}</span>
          </span>
          {mergeCost !== undefined && (
            <span className="text-muted-foreground">
              Last Merge:{" "}
              <span className="text-secondary font-mono">+{mergeCost}</span>
            </span>
          )}
        </div>
      </div>

      {/* Priority Queue visualization */}
      <div className="mb-6">
        <div className="text-xs text-muted-foreground mb-2">
          Priority Queue (Min-Heap)
        </div>

        <div className="flex items-end gap-3 h-32 p-2 bg-panel rounded-lg">
          {heap.map((size, idx) => {
            const heightPercent = (size / maxSize) * 100;
            const widthPercent = (size / maxSize) * 100;

            const isSelected =
              selected.includes(size) &&
              (idx === 0 ||
                idx === 1 ||
                (selected[0] === size && heap.indexOf(selected[0]) === idx) ||
                (selected[1] === size &&
                  heap.slice(1).indexOf(selected[1]) + 1 === idx));

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-1"
                style={{
                  width: `${Math.max(widthPercent, 20)}%`,
                  transition: "width 0.5s ease",
                }}
              >
                <div
                  className={cn(
                    "w-full rounded-t transition-all duration-500 flex items-end justify-center",
                    isSelected ? "bg-primary glow-primary" : "bg-secondary/60",
                    idx < 2 && selected.length > 0 && "ring-2 ring-primary"
                  )}
                  style={{
                    height: `${Math.max(heightPercent, 25)}%`,
                  }}
                >
                  <span className="text-xs font-mono text-foreground pb-1">
                    {size}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{idx + 1}</span>
              </div>
            );
          })}

          {heap.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Empty
            </div>
          )}
        </div>
      </div>

      {/* Active files */}
      <div className="mb-6">
        <div className="text-xs text-muted-foreground mb-2">Files</div>
        <div className="flex flex-wrap gap-2">
          {activeNodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2",
                node.active
                  ? "bg-primary text-primary-foreground glow-primary scale-110"
                  : "bg-panel-hover text-foreground"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-current opacity-60" />
              <span className="font-mono text-sm">{node.size}</span>
            </div>
          ))}
          {activeNodes.length === 0 && (
            <div className="text-muted-foreground text-sm">
              All files merged
            </div>
          )}
        </div>
      </div>

      {/* Merge History */}
      <div>
        <div className="text-xs text-muted-foreground mb-2">Merge History</div>
        <div className="space-y-2 max-h-24 overflow-y-auto">
          {mergeHistory.length === 0 ? (
            <div className="text-sm text-muted-foreground">No merges yet</div>
          ) : (
            mergeHistory.map((merge, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 text-xs p-2 rounded bg-panel",
                  idx === mergeHistory.length - 1 && "ring-1 ring-secondary"
                )}
              >
                <span className="text-muted-foreground">#{idx + 1}</span>
                <span className="font-mono">{merge.first}</span>
                <span className="text-muted-foreground">+</span>
                <span className="font-mono">{merge.second}</span>
                <span className="text-muted-foreground">=</span>
                <span className="font-mono text-primary">{merge.result}</span>
                <span className="ml-auto text-secondary">
                  cost: +{merge.cost}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
