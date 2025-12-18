import { VisualizationStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface SudokuVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

export function SudokuVisualizer({ currentStep, className }: SudokuVisualizerProps) {
  const payload = currentStep?.payload || {};
  const board = (payload.board as number[][]) || Array(9).fill(0).map(() => Array(9).fill(0));
  const fixed = (payload.fixed as boolean[][]) || Array(9).fill(false).map(() => Array(9).fill(false));
  const currentRow = payload.row as number | undefined;
  const currentCol = payload.col as number | undefined;
  const tryingNum = payload.num as number | undefined;
  const isValid = payload.valid as boolean | undefined;
  const kind = currentStep?.kind || 'init';

  const getCellClass = (row: number, col: number) => {
    const isActive = row === currentRow && col === currentCol;
    const isFixed = fixed[row]?.[col];
    
    let baseClass = 'w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm sm:text-base font-mono transition-all duration-200';
    
    // Subgrid borders
    const rightBorder = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-primary/50' : 'border-r border-r-border/50';
    const bottomBorder = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-primary/50' : 'border-b border-b-border/50';
    
    baseClass += ` ${rightBorder} ${bottomBorder}`;

    if (isActive) {
      if (kind === 'backtrack') {
        return `${baseClass} bg-destructive/30 text-destructive-foreground ring-2 ring-destructive animate-pulse`;
      }
      if (kind === 'check-valid' && isValid === false) {
        return `${baseClass} bg-destructive/20 text-destructive ring-2 ring-destructive`;
      }
      if (kind === 'place-number' || (kind === 'check-valid' && isValid === true)) {
        return `${baseClass} bg-success/30 text-success ring-2 ring-success`;
      }
      return `${baseClass} bg-secondary/30 ring-2 ring-secondary`;
    }
    
    if (isFixed) {
      return `${baseClass} bg-muted/50 text-foreground font-bold`;
    }
    
    return `${baseClass} bg-background/50 text-primary`;
  };

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Sudoku Grid</h3>
        
        <div className="border-2 border-primary/50 rounded-lg overflow-hidden bg-background/30">
          {board.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((cell, colIdx) => (
                <div
                  key={colIdx}
                  className={getCellClass(rowIdx, colIdx)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Status panel */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {currentStep?.description || 'Ready to solve'}
          </p>
          {tryingNum !== undefined && currentRow !== undefined && (
            <p className="text-xs text-secondary mt-1">
              Testing: {tryingNum} at ({currentRow}, {currentCol})
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-muted/50 rounded" />
            <span className="text-muted-foreground">Fixed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-secondary/30 rounded ring-2 ring-secondary" />
            <span className="text-muted-foreground">Trying</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-success/30 rounded" />
            <span className="text-muted-foreground">Placed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-destructive/30 rounded" />
            <span className="text-muted-foreground">Backtrack</span>
          </div>
        </div>
      </div>
    </div>
  );
}
