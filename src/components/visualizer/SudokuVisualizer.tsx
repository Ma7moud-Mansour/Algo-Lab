import { VisualizationStep } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface SudokuVisualizerProps {
  currentStep: VisualizationStep | null;
  initialBoard?: number[][];
  className?: string;
}

const CELL_SIZE = 32; // Fixed cell size in pixels
const GRID_SIZE = 9;
const GRID_DIMENSION = CELL_SIZE * GRID_SIZE;

export function SudokuVisualizer({ currentStep, initialBoard, className }: SudokuVisualizerProps) {
  const payload = currentStep?.payload || {};
  const board = (payload.board as number[][]) || initialBoard || Array(9).fill(0).map(() => Array(9).fill(0));
  const fixed = (payload.fixed as boolean[][]) || (initialBoard ? initialBoard.map(row => row.map(cell => cell !== 0)) : Array(9).fill(false).map(() => Array(9).fill(false)));
  const currentRow = payload.row as number | undefined;
  const currentCol = payload.col as number | undefined;
  const tryingNum = payload.num as number | undefined;
  const isValid = payload.valid as boolean | undefined;
  const kind = currentStep?.kind || 'init';

  // Find conflicting cells when testing a number
  const getConflictingCells = (): Set<string> => {
    const conflicts = new Set<string>();
    if (tryingNum === undefined || currentRow === undefined || currentCol === undefined) {
      return conflicts;
    }

    // Check same row
    for (let col = 0; col < 9; col++) {
      if (col !== currentCol && board[currentRow][col] === tryingNum) {
        conflicts.add(`${currentRow}-${col}`);
      }
    }

    // Check same column
    for (let row = 0; row < 9; row++) {
      if (row !== currentRow && board[row][currentCol] === tryingNum) {
        conflicts.add(`${row}-${currentCol}`);
      }
    }

    // Check same 3x3 box
    const boxRow = Math.floor(currentRow / 3) * 3;
    const boxCol = Math.floor(currentCol / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = boxRow + i;
        const c = boxCol + j;
        if ((r !== currentRow || c !== currentCol) && board[r][c] === tryingNum) {
          conflicts.add(`${r}-${c}`);
        }
      }
    }

    return conflicts;
  };

  const conflictingCells = getConflictingCells();
  const isTesting = (kind === 'try-number' || kind === 'check-valid') && tryingNum !== undefined;
  const showConflicts = isTesting && isValid === false;

  const getCellClass = (row: number, col: number) => {
    const isActive = row === currentRow && col === currentCol;
    const isFixed = fixed[row]?.[col];
    const isConflict = showConflicts && conflictingCells.has(`${row}-${col}`);
    const isInSameRow = showConflicts && row === currentRow && col !== currentCol;
    const isInSameCol = showConflicts && col === currentCol && row !== currentRow;
    const boxRow = currentRow !== undefined ? Math.floor(currentRow / 3) * 3 : -1;
    const boxCol = currentCol !== undefined ? Math.floor(currentCol / 3) * 3 : -1;
    const isInSameBox = showConflicts && 
      row >= boxRow && row < boxRow + 3 && 
      col >= boxCol && col < boxCol + 3 &&
      (row !== currentRow || col !== currentCol);
    
    // Subgrid borders
    const rightBorder = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-primary/50' : 'border-r border-r-border/50';
    const bottomBorder = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-primary/50' : 'border-b border-b-border/50';
    
    let stateClass = 'bg-background/50 text-primary';

    if (isConflict) {
      // Conflicting cell - highlight in orange/purple
      stateClass = 'bg-orange-500/60 ring-2 ring-inset ring-orange-600 text-orange-100 font-bold';
    } else if (isInSameRow || isInSameCol || isInSameBox) {
      // Same row/column/box being tested - subtle highlight
      stateClass = 'bg-purple-500/20 ring-1 ring-inset ring-purple-400/50';
    } else if (isActive) {
      if (kind === 'backtrack') {
        stateClass = 'bg-destructive/30 text-destructive-foreground ring-2 ring-inset ring-destructive';
      } else if (kind === 'check-valid' && isValid === false) {
        stateClass = 'bg-destructive/40 text-destructive ring-2 ring-inset ring-destructive';
      } else if (kind === 'place-number' || (kind === 'check-valid' && isValid === true)) {
        stateClass = 'bg-success/30 text-success ring-2 ring-inset ring-success';
      } else {
        stateClass = 'bg-secondary/30 ring-2 ring-inset ring-secondary';
      }
    } else if (isFixed) {
      stateClass = 'bg-muted/50 text-foreground font-bold';
    }
    
    return cn(
      'flex items-center justify-center text-sm font-mono transition-colors duration-150',
      rightBorder,
      bottomBorder,
      stateClass
    );
  };

  const getCellContent = (row: number, col: number) => {
    const cellValue = board[row]?.[col] ?? 0;
    const isActive = row === currentRow && col === currentCol;
    const isTestingThisCell = isTesting && isActive;
    
    // Show tested number if testing this cell (even if not yet validated)
    if (isTestingThisCell && tryingNum !== undefined) {
      return tryingNum;
    }
    
    // Show actual cell value
    return cellValue !== 0 ? cellValue : '';
  };

  const getCellTextColor = (row: number, col: number) => {
    const isActive = row === currentRow && col === currentCol;
    const isTestingThisCell = isTesting && isActive;
    
    // Red text when testing (especially when invalid)
    if (isTestingThisCell) {
      if (isValid === false) {
        return 'text-red-600 font-bold';
      } else if (isValid === true) {
        return 'text-green-600 font-bold';
      } else {
        // Still testing, show in red to indicate it's being tried
        return 'text-red-500 font-bold';
      }
    }
    
    return '';
  };

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Sudoku Grid</h3>
        
        {/* Fixed-size container */}
        <div 
          className="border-2 border-primary/50 rounded-lg overflow-hidden bg-background/30 flex-shrink-0"
          style={{ width: GRID_DIMENSION + 4, height: GRID_DIMENSION + 4 }}
        >
          <div 
            className="grid"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
          >
            {board.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={getCellClass(rowIdx, colIdx)}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  <span className={getCellTextColor(rowIdx, colIdx)}>
                    {getCellContent(rowIdx, colIdx)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status panel */}
        <div className="mt-3 text-center min-h-[40px]">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {currentStep?.description || 'Ready to solve'}
          </p>
          {tryingNum !== undefined && currentRow !== undefined && (
            <p className="text-xs text-secondary mt-1">
              Testing: {tryingNum} at ({currentRow}, {currentCol})
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs justify-center flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted/50 rounded" />
            <span className="text-muted-foreground">Fixed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-secondary/30 rounded ring-1 ring-secondary" />
            <span className="text-muted-foreground">Trying</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success/30 rounded" />
            <span className="text-muted-foreground">Placed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-destructive/30 rounded" />
            <span className="text-muted-foreground">Backtrack</span>
          </div>
          {showConflicts && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500/60 rounded ring-1 ring-orange-600" />
                <span className="text-muted-foreground">Conflict</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500/20 rounded ring-1 ring-purple-400/50" />
                <span className="text-muted-foreground">Same Region</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
