import { useMemo } from 'react';
import { VisualizationStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface MazeVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

const MAX_GRID_DIMENSION = 280; // Maximum grid dimension in pixels

export function MazeVisualizer({ currentStep, className }: MazeVisualizerProps) {
  const payload = currentStep?.payload || {};
  const maze = (payload.maze as number[][]) || [];
  const solution = (payload.solution as number[][]) || [];
  const visited = (payload.visited as boolean[][]) || [];
  const size = (payload.size as number) || 5;
  const tryX = payload.x as number | undefined;
  const tryY = payload.y as number | undefined;
  const kind = currentStep?.kind || 'init';
  const solved = payload.solved as boolean | undefined;

  // Calculate fixed cell size based on grid size
  const cellSize = useMemo(() => Math.floor(MAX_GRID_DIMENSION / size), [size]);
  const gridDimension = cellSize * size;

  // Derive the rat's current position from the active path in the solution matrix
  const currentPosition = useMemo(() => {
    let pos: { row: number; col: number } | null = null;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (solution[r]?.[c] === 1) {
          if (!pos || r + c > pos.row + pos.col) {
            pos = { row: r, col: c };
          }
        }
      }
    }

    // Fallback to start cell if no path is marked yet
    if (!pos && maze[0]?.[0] === 1) {
      return { row: 0, col: 0 };
    }

    return pos;
  }, [solution, maze, size]);

  const currentRow = currentPosition?.row;
  const currentCol = currentPosition?.col;

  const getCellClass = (row: number, col: number) => {
    const isWall = maze[row]?.[col] === 0;
    const isPath = solution[row]?.[col] === 1;
    const isVisited = visited[row]?.[col];
    const isCurrent = row === currentRow && col === currentCol;
    const isTryTarget = tryX !== undefined && tryY !== undefined && row === tryX && col === tryY;
    
    // Show red highlight when trying a cell that is invalid
    // - For 'blocked' kind: always show red (explicitly a failed attempt)
    // - For 'try-cell' kind: show red if cell is wall or already visited
    const isTryingInvalidCell = 
      isTryTarget && (
        kind === 'blocked' || 
        (kind === 'try-cell' && (isWall || isVisited || maze[row]?.[col] !== 1))
      );
    
    const isStart = row === 0 && col === 0;
    const isEnd = row === size - 1 && col === size - 1;
    
    let stateClass = 'bg-background/50';

    // Red highlight for invalid cells being tried - highest visual priority
    if (isTryingInvalidCell) {
      stateClass = '!bg-red-600 !ring-4 !ring-red-800 shadow-[0_0_20px_rgba(220,38,38,1)]';
    } else if (isWall) {
      stateClass = 'bg-slate-800 dark:bg-slate-900';
    } else if (isCurrent) {
      if (kind === 'backtrack') {
        stateClass = 'bg-destructive/50 ring-2 ring-inset ring-destructive';
      } else if (kind === 'destination-reached') {
        stateClass = 'bg-success ring-2 ring-inset ring-success';
      } else {
        stateClass = 'bg-secondary/70 ring-2 ring-inset ring-secondary';
      }
    } else if (isPath) {
      if (isStart) {
        stateClass = 'bg-info/50 ring-2 ring-inset ring-info';
      } else if (isEnd) {
        stateClass = 'bg-success/50 ring-2 ring-inset ring-success';
      } else {
        stateClass = 'bg-primary/40';
      }
    } else if (isVisited && !isPath) {
      stateClass = 'bg-muted/30';
    } else if (isStart) {
      stateClass = 'bg-info/30';
    } else if (isEnd) {
      stateClass = 'bg-success/30';
    }

    return cn(
      'flex items-center justify-center text-sm font-bold transition-colors duration-150 border border-border/30',
      stateClass
    );
  };

  const getCellContent = (row: number, col: number) => {
    const isWall = maze[row]?.[col] === 0;
    const isCurrent = row === currentRow && col === currentCol;
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
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Rat in a Maze ({size}×{size})</h3>
        
        {/* Fixed-size container */}
        <div 
          className="border-2 border-primary/50 rounded-lg overflow-hidden bg-background/20 flex-shrink-0"
          style={{ width: gridDimension + 4, height: gridDimension + 4 }}
        >
          <div 
            className="grid"
            style={{ 
              gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
            }}
          >
            {Array.from({ length: size }).map((_, rowIdx) =>
              Array.from({ length: size }).map((_, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={getCellClass(rowIdx, colIdx)}
                  style={{ width: cellSize, height: cellSize, fontSize: cellSize > 40 ? '1rem' : '0.75rem' }}
                >
                  {getCellContent(rowIdx, colIdx)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status panel */}
        <div className="mt-3 text-center min-h-[40px]">
          <p className="text-sm text-muted-foreground line-clamp-2">
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
        <div className="flex flex-wrap gap-3 mt-3 text-xs justify-center flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-800 rounded" />
            <span className="text-muted-foreground">Wall</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-info/50 rounded" />
            <span className="text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success/50 rounded" />
            <span className="text-muted-foreground">End</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary/40 rounded" />
            <span className="text-muted-foreground">Path</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-secondary/70 rounded" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded ring-1 ring-red-600" />
            <span className="text-muted-foreground">Trying (Invalid)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
