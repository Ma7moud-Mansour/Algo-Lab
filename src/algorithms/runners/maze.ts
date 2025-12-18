import { VisualizationStep, AlgorithmRunner } from '@/types/algorithm';

export interface MazeInput {
  maze: number[][];
  size: number;
  [key: string]: unknown;
}

const defaultMaze = [
  [1, 0, 0, 0, 0],
  [1, 1, 0, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 1, 1],
];

export const ratMazeRunner: AlgorithmRunner<MazeInput> = {
  getInitialInput: () => ({
    maze: defaultMaze.map(row => [...row]),
    size: 5,
  }),

  generateSteps: (input: MazeInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const n = input.size;
    const maze = input.maze.map(row => [...row]);
    const solution: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const visited: boolean[][] = Array(n).fill(false).map(() => Array(n).fill(false));

    steps.push({
      kind: 'init',
      payload: { maze, solution: solution.map(r => [...r]), size: n, visited: visited.map(r => [...r]) },
      codeLine: 0,
      description: `Starting Rat in a Maze (${n}×${n} grid)`,
    });

    function isSafe(x: number, y: number): boolean {
      return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1 && !visited[x][y];
    }

    let solved = false;

    function solve(x: number, y: number): boolean {
      steps.push({
        kind: 'try-cell',
        payload: { maze, solution: solution.map(r => [...r]), size: n, x, y, visited: visited.map(r => [...r]) },
        codeLine: 8,
        description: `Trying cell (${x}, ${y})`,
      });

      if (x === n - 1 && y === n - 1 && maze[x][y] === 1) {
        solution[x][y] = 1;
        steps.push({
          kind: 'destination-reached',
          payload: { maze, solution: solution.map(r => [...r]), size: n, x, y, visited: visited.map(r => [...r]) },
          codeLine: 9,
          description: `Destination reached at (${x}, ${y})!`,
        });
        solved = true;
        return true;
      }

      if (isSafe(x, y)) {
        solution[x][y] = 1;
        visited[x][y] = true;

        steps.push({
          kind: 'move',
          payload: { maze, solution: solution.map(r => [...r]), size: n, x, y, visited: visited.map(r => [...r]) },
          codeLine: 14,
          description: `Moving to (${x}, ${y})`,
        });

        // Move right
        if (solve(x, y + 1)) return true;

        // Move down
        if (solve(x + 1, y)) return true;

        // Move left
        if (solve(x, y - 1)) return true;

        // Move up
        if (solve(x - 1, y)) return true;

        // Backtrack
        solution[x][y] = 0;

        steps.push({
          kind: 'backtrack',
          payload: { maze, solution: solution.map(r => [...r]), size: n, x, y, visited: visited.map(r => [...r]) },
          codeLine: 22,
          description: `Backtracking from (${x}, ${y})`,
        });

        return false;
      }

      steps.push({
        kind: 'blocked',
        payload: { maze, solution: solution.map(r => [...r]), size: n, x, y, visited: visited.map(r => [...r]) },
        codeLine: 4,
        description: `Cell (${x}, ${y}) is blocked or already visited`,
      });

      return false;
    }

    if (maze[0][0] === 1) {
      solve(0, 0);
    }

    steps.push({
      kind: 'complete',
      payload: { maze, solution: solution.map(r => [...r]), size: n, solved, visited: visited.map(r => [...r]) },
      codeLine: 28,
      description: solved ? 'Path found!' : 'No path exists',
    });

    return steps;
  },

  validateInput: (input: MazeInput) => {
    if (!input.maze || input.size < 2 || input.size > 8) {
      return { valid: false, error: 'Maze size must be between 2 and 8' };
    }
    return { valid: true };
  },
};
