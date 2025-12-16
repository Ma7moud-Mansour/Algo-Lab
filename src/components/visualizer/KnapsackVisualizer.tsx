import { VisualizationStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface KnapsackVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

interface ItemState {
  index: number;
  weight: number;
  value: number;
  ratio: number;
  status: string;
  fraction: number;
}

export function KnapsackVisualizer({ currentStep, className }: KnapsackVisualizerProps) {
  const payload = currentStep?.payload || {};
  const items: ItemState[] = (payload.items as ItemState[]) || [];
  const capacity = (payload.capacity as number) || 50;
  const remainingCapacity = (payload.remainingCapacity as number) ?? capacity;
  const totalValue = (payload.totalValue as number) || 0;
  const currentIndex = payload.currentIndex as number | undefined;

  const filledCapacity = capacity - remainingCapacity;
  const fillPercentage = (filledCapacity / capacity) * 100;

  const getItemColor = (item: ItemState, idx: number) => {
    if (item.status === 'full') return 'bg-success';
    if (item.status === 'partial') return 'bg-secondary';
    if (item.status === 'skipped') return 'bg-muted';
    if (currentIndex === idx) return 'bg-primary animate-pulse';
    return 'bg-panel-hover';
  };

  const getItemBorder = (item: ItemState, idx: number) => {
    if (currentIndex === idx) return 'ring-2 ring-primary glow-primary';
    if (item.status === 'full') return 'ring-2 ring-success';
    if (item.status === 'partial') return 'ring-2 ring-secondary';
    return '';
  };

  return (
    <div className={cn('glass-panel p-4 overflow-hidden', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Fractional Knapsack</h3>
        <div className="flex gap-4 text-xs">
          <span className="text-muted-foreground">
            Capacity: <span className="text-foreground font-mono">{filledCapacity.toFixed(1)}/{capacity}</span>
          </span>
          <span className="text-muted-foreground">
            Value: <span className="text-success font-mono">{totalValue.toFixed(2)}</span>
          </span>
        </div>
      </div>

      {/* Knapsack capacity bar */}
      <div className="mb-6">
        <div className="text-xs text-muted-foreground mb-2">Knapsack Capacity</div>
        <div className="h-8 bg-panel-border rounded-lg overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
            style={{ width: `${fillPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-foreground">
            {fillPercentage.toFixed(1)}% filled
          </div>
        </div>
      </div>

      {/* Items display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              'p-3 rounded-lg transition-all duration-300',
              getItemColor(item, idx),
              getItemBorder(item, idx)
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-foreground">Item {item.index + 1}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                item.status === 'full' && 'bg-success/20 text-success',
                item.status === 'partial' && 'bg-secondary/20 text-secondary',
                item.status === 'skipped' && 'bg-muted-foreground/20 text-muted-foreground',
                item.status === 'pending' && 'bg-foreground/10 text-foreground'
              )}>
                {item.status === 'full' && '100%'}
                {item.status === 'partial' && `${(item.fraction * 100).toFixed(1)}%`}
                {item.status === 'skipped' && 'Skip'}
                {item.status === 'pending' && 'Pending'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Weight</div>
                <div className="font-mono text-foreground">{item.weight}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Value</div>
                <div className="font-mono text-foreground">{item.value}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Ratio</div>
                <div className="font-mono text-primary">{item.ratio.toFixed(2)}</div>
              </div>
            </div>
            {/* Visual fill bar */}
            {item.fraction > 0 && (
              <div className="mt-2 h-2 bg-panel-border rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    item.status === 'full' ? 'bg-success' : 'bg-secondary'
                  )}
                  style={{ width: `${item.fraction * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success" />
          <span>Full</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted" />
          <span>Skipped</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary animate-pulse" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}
