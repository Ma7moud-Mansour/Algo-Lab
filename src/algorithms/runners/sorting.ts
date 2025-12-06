import { VisualizationStep, AlgorithmRunner } from '@/types/algorithm';

export interface SortingInput {
  array: number[];
}

export const bubbleSortRunner: AlgorithmRunner<SortingInput> = {
  getInitialInput: () => ({
    array: [64, 34, 25, 12, 22, 11, 90],
  }),
  
  generateSteps: (input: SortingInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const arr = [...input.array];
    const n = arr.length;

    steps.push({
      kind: 'init',
      payload: { array: [...arr] },
      codeLine: 0,
      description: 'Initialize the array',
    });

    for (let i = 0; i < n - 1; i++) {
      steps.push({
        kind: 'outer-loop',
        payload: { i, array: [...arr] },
        codeLine: 3,
        description: `Pass ${i + 1}: Bubbling largest to position ${n - 1 - i}`,
      });

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          kind: 'compare',
          payload: { indices: [j, j + 1], array: [...arr] },
          codeLine: 6,
          description: `Compare arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}`,
        });

        if (arr[j] > arr[j + 1]) {
          steps.push({
            kind: 'swap',
            payload: { indices: [j, j + 1], array: [...arr] },
            codeLine: 8,
            description: `Swap ${arr[j]} and ${arr[j + 1]}`,
          });
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            kind: 'after-swap',
            payload: { indices: [j, j + 1], array: [...arr] },
            codeLine: 8,
            description: `After swap: arr[${j}]=${arr[j]}, arr[${j + 1}]=${arr[j + 1]}`,
          });
        }
      }

      steps.push({
        kind: 'sorted',
        payload: { index: n - 1 - i, array: [...arr] },
        codeLine: 11,
        description: `Element at position ${n - 1 - i} is now sorted`,
      });
    }

    steps.push({
      kind: 'complete',
      payload: { array: [...arr] },
      codeLine: 13,
      description: 'Array is fully sorted!',
    });

    return steps;
  },

  validateInput: (input: SortingInput) => {
    if (!Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Please provide a non-empty array' };
    }
    if (input.array.some(isNaN)) {
      return { valid: false, error: 'All elements must be numbers' };
    }
    return { valid: true };
  },
};

export const selectionSortRunner: AlgorithmRunner<SortingInput> = {
  getInitialInput: () => ({
    array: [64, 25, 12, 22, 11],
  }),

  generateSteps: (input: SortingInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const arr = [...input.array];
    const n = arr.length;

    steps.push({
      kind: 'init',
      payload: { array: [...arr] },
      codeLine: 0,
      description: 'Initialize the array',
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({
        kind: 'select-min-start',
        payload: { currentMin: i, array: [...arr] },
        codeLine: 4,
        description: `Finding minimum in unsorted portion starting at index ${i}`,
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          kind: 'compare',
          payload: { indices: [minIdx, j], array: [...arr] },
          codeLine: 8,
          description: `Compare arr[${minIdx}]=${arr[minIdx]} with arr[${j}]=${arr[j]}`,
        });

        if (arr[j] < arr[minIdx]) {
          steps.push({
            kind: 'new-min',
            payload: { oldMin: minIdx, newMin: j, array: [...arr] },
            codeLine: 9,
            description: `New minimum found: ${arr[j]} at index ${j}`,
          });
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        steps.push({
          kind: 'swap',
          payload: { indices: [i, minIdx], array: [...arr] },
          codeLine: 15,
          description: `Swap arr[${i}]=${arr[i]} with arr[${minIdx}]=${arr[minIdx]}`,
        });
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          kind: 'after-swap',
          payload: { indices: [i, minIdx], array: [...arr] },
          codeLine: 15,
          description: `After swap`,
        });
      }

      steps.push({
        kind: 'sorted',
        payload: { index: i, array: [...arr] },
        codeLine: 17,
        description: `Element at position ${i} is now sorted`,
      });
    }

    steps.push({
      kind: 'complete',
      payload: { array: [...arr] },
      codeLine: 19,
      description: 'Array is fully sorted!',
    });

    return steps;
  },

  validateInput: (input: SortingInput) => {
    if (!Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Please provide a non-empty array' };
    }
    return { valid: true };
  },
};

export const quickSortRunner: AlgorithmRunner<SortingInput> = {
  getInitialInput: () => ({
    array: [38, 27, 43, 3, 9, 82, 10],
  }),

  generateSteps: (input: SortingInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const arr = [...input.array];

    steps.push({
      kind: 'init',
      payload: { array: [...arr] },
      codeLine: 0,
      description: 'Initialize the array',
    });

    const partition = (low: number, high: number): number => {
      const pivot = arr[high];
      steps.push({
        kind: 'pivot-select',
        payload: { pivotIndex: high, pivot, low, high, array: [...arr] },
        codeLine: 14,
        description: `Select pivot: ${pivot} at index ${high}`,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({
          kind: 'compare',
          payload: { indices: [j, high], i, pivot, array: [...arr] },
          codeLine: 18,
          description: `Compare arr[${j}]=${arr[j]} with pivot ${pivot}`,
        });

        if (arr[j] <= pivot) {
          i++;
          if (i !== j) {
            steps.push({
              kind: 'swap',
              payload: { indices: [i, j], array: [...arr] },
              codeLine: 20,
              description: `Swap arr[${i}]=${arr[i]} with arr[${j}]=${arr[j]}`,
            });
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({
              kind: 'after-swap',
              payload: { indices: [i, j], array: [...arr] },
              codeLine: 20,
              description: 'After swap',
            });
          }
        }
      }

      steps.push({
        kind: 'swap',
        payload: { indices: [i + 1, high], array: [...arr] },
        codeLine: 24,
        description: `Place pivot at correct position: swap arr[${i + 1}]=${arr[i + 1]} with pivot ${arr[high]}`,
      });
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({
        kind: 'pivot-placed',
        payload: { pivotIndex: i + 1, array: [...arr] },
        codeLine: 24,
        description: `Pivot ${pivot} is now at its final position ${i + 1}`,
      });

      return i + 1;
    };

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        steps.push({
          kind: 'partition-start',
          payload: { low, high, array: [...arr] },
          codeLine: 2,
          description: `Partitioning subarray [${low}...${high}]`,
        });

        const pivotIdx = partition(low, high);

        steps.push({
          kind: 'recurse-left',
          payload: { low, high: pivotIdx - 1, array: [...arr] },
          codeLine: 5,
          description: `Recursing on left partition [${low}...${pivotIdx - 1}]`,
        });
        quickSort(low, pivotIdx - 1);

        steps.push({
          kind: 'recurse-right',
          payload: { low: pivotIdx + 1, high, array: [...arr] },
          codeLine: 8,
          description: `Recursing on right partition [${pivotIdx + 1}...${high}]`,
        });
        quickSort(pivotIdx + 1, high);
      }
    };

    quickSort(0, arr.length - 1);

    steps.push({
      kind: 'complete',
      payload: { array: [...arr] },
      codeLine: 10,
      description: 'Array is fully sorted!',
    });

    return steps;
  },

  validateInput: (input: SortingInput) => {
    if (!Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Please provide a non-empty array' };
    }
    return { valid: true };
  },
};
