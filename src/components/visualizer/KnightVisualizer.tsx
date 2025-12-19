import { useMemo } from 'react';
import { VisualizationStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface KnightVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

const MAX_GRID_DIMENSION = 280; // Maximum grid dimension in pixels

export function KnightVisualizer({ currentStep, className }: KnightVisualizerProps) {
  const payload = currentStep?.payload || {};
  const board = (payload.board as number[][]) || [];
  const size = (payload.size as number) || 5;
  const currentX = payload.x as number | undefined;
  const currentY = payload.y as number | undefined;
  const nextX = payload.nextX as number | undefined;
  const nextY = payload.nextY as number | undefined;
  const moveCount = payload.moveCount as number | undefined;
  const accessCount = payload.accessCount as number | undefined;
  const kind = currentStep?.kind || 'init';
  const solved = payload.solved as boolean | undefined;

  // Calculate fixed cell size based on grid size
  const cellSize = useMemo(() => Math.floor(MAX_GRID_DIMENSION / size), [size]);
  const gridDimension = cellSize * size;

  const getCellClass = (row: number, col: number) => {
    const value = board[row]?.[col] ?? -1;
    const isCurrent = row === currentX && col === currentY;
    const isNext = row === nextX && col === nextY;
    const isVisited = value >= 0;
    const isChessWhite = (row + col) % 2 === 0;
    
    let stateClass = isChessWhite ? 'bg-background/70' : 'bg-muted/50';

    if (isCurrent) {
      if (kind === 'backtrack') {
        stateClass = 'bg-destructive/50 ring-2 ring-inset ring-destructive';
      } else {
        stateClass = 'bg-secondary/70 ring-2 ring-inset ring-secondary';
      }
    } else if (isNext && kind === 'try-move') {
      stateClass = 'bg-info/50 ring-2 ring-inset ring-info';
    } else if (isVisited) {
      const progress = value / (size * size - 1);
      if (progress < 0.33) {
        stateClass = 'bg-primary/60 text-primary-foreground';
      } else if (progress < 0.66) {
        stateClass = 'bg-secondary/60 text-secondary-foreground';
      } else {
        stateClass = 'bg-success/60 text-success-foreground';
      }
    }

    return cn(
      'flex items-center justify-center font-bold transition-colors duration-150 border border-border/20',
      stateClass
    );
  };

  const getCellContent = (row: number, col: number) => {
    const value = board[row]?.[col] ?? -1;
    const isCurrent = row === currentX && col === currentY;
    const isNext = row === nextX && col === nextY && kind === 'try-move';

    if (isCurrent || (isNext && kind !== 'try-move' && kind !== 'backtrack')) {
      return '♞';
    }
    if (isNext && kind === 'try-move') {
      return '?';
    }
    if (value >= 0) {
      return value;
    }
    return '';
  };

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Knight's Tour</h3>
        
        {/* Stats */}
        <div className="flex gap-4 mb-2 text-xs flex-shrink-0 min-h-[20px]">
          <span className="text-muted-foreground">
            Board: {size}×{size}
          </span>
          {moveCount !== undefined && (
            <span className="text-secondary">
              Move: {moveCount}/{size * size}
            </span>
          )}
          {accessCount !== undefined && kind === 'try-move' && (
            <span className="text-info">
              Onward: {accessCount}
            </span>
          )}
        </div>

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
                  style={{ 
                    width: cellSize, 
                    height: cellSize, 
                    fontSize: cellSize > 40 ? '0.875rem' : '0.7rem' 
                  }}
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
            {currentStep?.description || 'Ready to start tour'}
          </p>
          {kind === 'complete' && (
            <p className={cn(
              'text-sm font-medium mt-1',
              solved ? 'text-success' : 'text-warning'
            )}>
              {solved ? '✓ Complete tour found!' : '⚠ Tour incomplete'}
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs justify-center flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary/60 rounded" />
            <span className="text-muted-foreground">Early</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-secondary/60 rounded" />
            <span className="text-muted-foreground">Mid</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success/60 rounded" />
            <span className="text-muted-foreground">Late</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-info/50 rounded" />
            <span className="text-muted-foreground">Trying</span>
          </div>
        </div>
      </div>
    </div>
  );
}
