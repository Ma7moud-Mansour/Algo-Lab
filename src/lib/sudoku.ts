
export function generateSudokuPuzzle(): number[][] {
  // Initialize empty 9x9 board
  const board = Array(9).fill(0).map(() => Array(9).fill(0));

  // Step 1: Fill diagonal 3x3 boxes (these are independent)
  fillDiagonalBox(board, 0, 0);
  fillDiagonalBox(board, 3, 3);
  fillDiagonalBox(board, 6, 6);

  // Step 2: Solve the rest of the board to get a complete valid Sudoku
  solveSudoku(board);

  // Step 3: Remove digits to create the puzzle
  // Removing ~40-50 digits usually gives a decent puzzle
  removeDigits(board, 45);

  return board;
}

function fillDiagonalBox(board: number[][], row: number, col: number) {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
}

function isSafeInBox(board: number[][], rowStart: number, colStart: number, num: number) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[rowStart + i][colStart + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function isSafe(board: number[][], row: number, col: number, num: number) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: number[][]): boolean {
  let row = -1;
  let col = -1;
  let isEmpty = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  // No empty space left
  if (!isEmpty) return true;

  for (let num = 1; num <= 9; num++) {
    if (isSafe(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

function removeDigits(board: number[][], count: number) {
  let k = count;
  while (k > 0) {
    const i = Math.floor(Math.random() * 9);
    const j = Math.floor(Math.random() * 9);
    if (board[i][j] !== 0) {
      board[i][j] = 0;
      k--;
    }
  }
}
