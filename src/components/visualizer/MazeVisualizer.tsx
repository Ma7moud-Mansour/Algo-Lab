import { VisualizationStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface MazeVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

export function MazeVisualizer({ currentStep, className }: MazeVisualizerProps) {
  const payload = currentStep?.payload || {};
  const maze = (payload.maze as number[][]) || [];
  const solution = (payload.solution as number[][]) || [];
  const visited = (payload.visited as boolean[][]) || [];
  const size = (payload.size as number) || 5;
  const currentX = payload.x as number | undefined;
  const currentY = payload.y as number | undefined;
  const kind = currentStep?.kind || 'init';
  const solved = payload.solved as boolean | undefined;

  const getCellClass = (row: number, col: number) => {
    const isWall = maze[row]?.[col] === 0;
    const isPath = solution[row]?.[col] === 1;
    const isVisited = visited[row]?.[col];
    const isCurrent = row === currentX && col === currentY;
    const isStart = row === 0 && col === 0;
    const isEnd = row === size - 1 && col === size - 1;
    
    const cellSize = size <= 5 ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12';
    let baseClass = `${cellSize} flex items-center justify-center text-lg font-bold transition-all duration-300 border border-border/30`;

    if (isWall) {
      return `${baseClass} bg-slate-800 dark:bg-slate-900`;
    }

    if (isCurrent) {
      if (kind === 'backtrack') {
        return `${baseClass} bg-destructive/50 ring-2 ring-destructive animate-pulse`;
      }
      if (kind === 'destination-reached') {
        return `${baseClass} bg-success ring-2 ring-success animate-pulse`;
      }
      return `${baseClass} bg-secondary/70 ring-2 ring-secondary`;
    }

    if (isPath) {
      if (isStart) {
        return `${baseClass} bg-info/50 ring-2 ring-info`;
      }
      if (isEnd) {
        return `${baseClass} bg-success/50 ring-2 ring-success`;
      }
      return `${baseClass} bg-primary/40`;
    }

    if (isVisited && !isPath) {
      return `${baseClass} bg-muted/30`;
    }

    if (isStart) {
      return `${baseClass} bg-info/30`;
    }

    if (isEnd) {
      return `${baseClass} bg-success/30`;
    }

    return `${baseClass} bg-background/50`;
  };

  const getCellContent = (row: number, col: number) => {
    const isWall = maze[row]?.[col] === 0;
    const isCurrent = row === currentX && col === currentY;
    const isStart = row === 0 && col === 0;
    const isEnd = row === size - 1 && col === size - 1;

    if (isWall) return '🧱';
    if (isCurrent) return '🐀';
    if (isStart) return 'S';
    if (isEnd) return 'E';
    return '';
  };

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Rat in a Maze</h3>
        
        <div className="border-2 border-primary/50 rounded-lg overflow-hidden bg-background/20">
          {Array.from({ length: size }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex">
              {Array.from({ length: size }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  className={getCellClass(rowIdx, colIdx)}
                >
                  {getCellContent(rowIdx, colIdx)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Status panel */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {currentStep?.description || 'Ready to find path'}
          </p>
          {kind === 'complete' && (
            <p className={cn(
              'text-sm font-medium mt-1',
              solved ? 'text-success' : 'text-destructive'
            )}>
              {solved ? '✓ Path found!' : '✗ No path exists'}
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs justify-center">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-slate-800 rounded" />
            <span className="text-muted-foreground">Wall</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-info/50 rounded" />
            <span className="text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-success/50 rounded" />
            <span className="text-muted-foreground">End</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-primary/40 rounded" />
            <span className="text-muted-foreground">Path</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-secondary/70 rounded" />
            <span className="text-muted-foreground">Current</span>
          </div>
        </div>
      </div>
    </div>
  );
}
