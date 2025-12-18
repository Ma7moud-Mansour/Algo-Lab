import { VisualizationStep, AlgorithmRunner } from '@/types/algorithm';

export interface KnightInput {
  size: number;
  startX: number;
  startY: number;
  [key: string]: unknown;
}

export const knightTourRunner: AlgorithmRunner<KnightInput> = {
  getInitialInput: () => ({
    size: 5,
    startX: 0,
    startY: 0,
  }),

  generateSteps: (input: KnightInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const n = input.size;
    const startX = input.startX;
    const startY = input.startY;
    const board: number[][] = Array(n).fill(-1).map(() => Array(n).fill(-1));
    
    const dx = [2, 1, -1, -2, -2, -1, 1, 2];
    const dy = [1, 2, 2, 1, -1, -2, -2, -1];

    steps.push({
      kind: 'init',
      payload: { board: board.map(r => [...r]), size: n, startX, startY },
      codeLine: 0,
      description: `Starting Knight's Tour on ${n}×${n} board from (${startX}, ${startY})`,
    });

    function isSafe(x: number, y: number): boolean {
      return x >= 0 && x < n && y >= 0 && y < n && board[x][y] === -1;
    }

    // Warnsdorff's heuristic: count available moves from a position
    function countMoves(x: number, y: number): number {
      let count = 0;
      for (let i = 0; i < 8; i++) {
        const nx = x + dx[i];
        const ny = y + dy[i];
        if (isSafe(nx, ny)) count++;
      }
      return count;
    }

    // Get moves sorted by Warnsdorff's rule (least available moves first)
    function getSortedMoves(x: number, y: number): { nx: number; ny: number; count: number }[] {
      const moves: { nx: number; ny: number; count: number }[] = [];
      for (let i = 0; i < 8; i++) {
        const nx = x + dx[i];
        const ny = y + dy[i];
        if (isSafe(nx, ny)) {
          moves.push({ nx, ny, count: countMoves(nx, ny) });
        }
      }
      return moves.sort((a, b) => a.count - b.count);
    }

    let solved = false;
    let stepLimit = 500; // Prevent infinite steps for visualization

    function solve(x: number, y: number, moveCount: number): boolean {
      if (moveCount === n * n) {
        solved = true;
        return true;
      }

      if (stepLimit <= 0) return false;
      stepLimit--;

      const moves = getSortedMoves(x, y);

      for (const move of moves) {
        const { nx, ny, count } = move;

        steps.push({
          kind: 'try-move',
          payload: { 
            board: board.map(r => [...r]), 
            size: n, 
            currentX: x, 
            currentY: y, 
            nextX: nx, 
            nextY: ny,
            moveCount,
            accessCount: count
          },
          codeLine: 13,
          description: `Trying move ${moveCount} to (${nx}, ${ny}) - ${count} onward moves available`,
        });

        board[nx][ny] = moveCount;

        steps.push({
          kind: 'place-knight',
          payload: { 
            board: board.map(r => [...r]), 
            size: n, 
            x: nx, 
            y: ny, 
            moveCount 
          },
          codeLine: 17,
          description: `Placed knight at (${nx}, ${ny}) - move ${moveCount}`,
        });

        if (solve(nx, ny, moveCount + 1)) return true;

        board[nx][ny] = -1;

        steps.push({
          kind: 'backtrack',
          payload: { 
            board: board.map(r => [...r]), 
            size: n, 
            x: nx, 
            y: ny, 
            moveCount 
          },
          codeLine: 20,
          description: `Backtracking from (${nx}, ${ny})`,
        });
      }

      return false;
    }

    board[startX][startY] = 0;
    steps.push({
      kind: 'start-position',
      payload: { board: board.map(r => [...r]), size: n, x: startX, y: startY },
      codeLine: 26,
      description: `Starting position set at (${startX}, ${startY})`,
    });

    solve(startX, startY, 1);

    steps.push({
      kind: 'complete',
      payload: { board: board.map(r => [...r]), size: n, solved },
      codeLine: 28,
      description: solved ? 'Knight\'s Tour complete!' : 'No complete tour found (step limit reached or impossible)',
    });

    return steps;
  },

  validateInput: (input: KnightInput) => {
    if (input.size < 5 || input.size > 8) {
      return { valid: false, error: 'Board size must be between 5 and 8' };
    }
    if (input.startX < 0 || input.startX >= input.size || input.startY < 0 || input.startY >= input.size) {
      return { valid: false, error: 'Starting position must be within the board' };
    }
    return { valid: true };
  },
};
