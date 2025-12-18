import { VisualizationStep, AlgorithmRunner } from '@/types/algorithm';

export interface SudokuInput {
  board: number[][];
  [key: string]: unknown;
}

const defaultPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export const sudokuRunner: AlgorithmRunner<SudokuInput> = {
  getInitialInput: () => ({
    board: defaultPuzzle.map(row => [...row]),
  }),

  generateSteps: (input: SudokuInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const board = input.board.map(row => [...row]);
    const fixed = input.board.map(row => row.map(cell => cell !== 0));

    steps.push({
      kind: 'init',
      payload: { board: board.map(r => [...r]), fixed },
      codeLine: 0,
      description: 'Starting Sudoku Solver',
    });

    function isValid(row: number, col: number, num: number): boolean {
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
      }
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[boxRow + i][boxCol + j] === num) return false;
        }
      }
      return true;
    }

    let solved = false;

    function solve(): boolean {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            steps.push({
              kind: 'find-empty',
              payload: { board: board.map(r => [...r]), fixed, row, col },
              codeLine: 20,
              description: `Found empty cell at (${row}, ${col})`,
            });

            for (let num = 1; num <= 9; num++) {
              steps.push({
                kind: 'try-number',
                payload: { board: board.map(r => [...r]), fixed, row, col, num },
                codeLine: 21,
                description: `Trying ${num} at (${row}, ${col})`,
              });

              const valid = isValid(row, col, num);

              steps.push({
                kind: 'check-valid',
                payload: { board: board.map(r => [...r]), fixed, row, col, num, valid },
                codeLine: 22,
                description: valid
                  ? `${num} is valid at (${row}, ${col})`
                  : `${num} conflicts at (${row}, ${col})`,
              });

              if (valid) {
                board[row][col] = num;

                steps.push({
                  kind: 'place-number',
                  payload: { board: board.map(r => [...r]), fixed, row, col, num },
                  codeLine: 23,
                  description: `Placed ${num} at (${row}, ${col})`,
                });

                if (solve()) return true;

                board[row][col] = 0;

                steps.push({
                  kind: 'backtrack',
                  payload: { board: board.map(r => [...r]), fixed, row, col },
                  codeLine: 25,
                  description: `Backtracking from (${row}, ${col})`,
                });
              }
            }
            return false;
          }
        }
      }
      solved = true;
      return true;
    }

    solve();

    steps.push({
      kind: 'complete',
      payload: { board: board.map(r => [...r]), fixed, solved },
      codeLine: 31,
      description: solved ? 'Sudoku solved!' : 'No solution exists',
    });

    return steps;
  },

  validateInput: (input: SudokuInput) => {
    if (!input.board || input.board.length !== 9) {
      return { valid: false, error: 'Board must be 9x9' };
    }
    return { valid: true };
  },
};
