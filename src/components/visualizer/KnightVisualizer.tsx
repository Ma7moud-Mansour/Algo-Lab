import { VisualizationStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface KnightVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

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

  const getCellClass = (row: number, col: number) => {
    const value = board[row]?.[col] ?? -1;
    const isCurrent = row === currentX && col === currentY;
    const isNext = row === nextX && col === nextY;
    const isVisited = value >= 0;
    const isChessWhite = (row + col) % 2 === 0;
    
    const cellSize = size <= 5 ? 'w-12 h-12 sm:w-14 sm:h-14' : size <= 6 ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10';
    let baseClass = `${cellSize} flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 border border-border/20`;

    if (isCurrent) {
      if (kind === 'backtrack') {
        return `${baseClass} bg-destructive/50 ring-2 ring-destructive animate-pulse`;
      }
      return `${baseClass} bg-secondary/70 ring-2 ring-secondary`;
    }

    if (isNext && kind === 'try-move') {
      return `${baseClass} bg-info/50 ring-2 ring-info animate-pulse`;
    }

    if (isVisited) {
      // Gradient from primary to success based on move order
      const progress = value / (size * size - 1);
      if (progress < 0.33) {
        return `${baseClass} bg-primary/60 text-primary-foreground`;
      } else if (progress < 0.66) {
        return `${baseClass} bg-secondary/60 text-secondary-foreground`;
      } else {
        return `${baseClass} bg-success/60 text-success-foreground`;
      }
    }

    // Chess pattern for unvisited
    return `${baseClass} ${isChessWhite ? 'bg-background/70' : 'bg-muted/50'}`;
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

  // Find current knight position for display
  let knightRow = -1, knightCol = -1;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r]?.[c] !== undefined && board[r][c] >= 0) {
        const max = Math.max(knightRow !== -1 ? board[knightRow][knightCol] : -1, board[r][c]);
        if (board[r][c] === max) {
          knightRow = r;
          knightCol = c;
        }
      }
    }
  }

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Knight's Tour</h3>
        
        {/* Stats */}
        <div className="flex gap-4 mb-3 text-xs">
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
              Onward moves: {accessCount}
            </span>
          )}
        </div>

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
        <div className="flex flex-wrap gap-3 mt-4 text-xs justify-center">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-primary/60 rounded" />
            <span className="text-muted-foreground">Early</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-secondary/60 rounded" />
            <span className="text-muted-foreground">Mid</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-success/60 rounded" />
            <span className="text-muted-foreground">Late</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-info/50 rounded" />
            <span className="text-muted-foreground">Trying</span>
          </div>
        </div>
      </div>
    </div>
  );
}
