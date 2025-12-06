import { VisualizationStep, AlgorithmRunner } from '@/types/algorithm';

export interface SearchingInput {
  array: number[];
  target: number;
}

export const binarySearchRunner: AlgorithmRunner<SearchingInput> = {
  getInitialInput: () => ({
    array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
    target: 23,
  }),

  generateSteps: (input: SearchingInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const arr = [...input.array];
    const target = input.target;
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      kind: 'init',
      payload: { array: arr, target, left, right },
      codeLine: 0,
      description: `Searching for ${target} in sorted array`,
    });

    steps.push({
      kind: 'set-bounds',
      payload: { left, right, array: arr },
      codeLine: 2,
      description: `Set left=${left}, right=${right}`,
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        kind: 'calculate-mid',
        payload: { left, right, mid, array: arr },
        codeLine: 5,
        description: `Calculate mid = floor((${left} + ${right}) / 2) = ${mid}`,
      });

      steps.push({
        kind: 'compare',
        payload: { mid, midValue: arr[mid], target, array: arr },
        codeLine: 7,
        description: `Compare arr[${mid}]=${arr[mid]} with target ${target}`,
      });

      if (arr[mid] === target) {
        steps.push({
          kind: 'found',
          payload: { index: mid, value: arr[mid], array: arr },
          codeLine: 8,
          description: `Found ${target} at index ${mid}!`,
        });
        return steps;
      }

      if (arr[mid] < target) {
        steps.push({
          kind: 'search-right',
          payload: { oldLeft: left, newLeft: mid + 1, right, array: arr },
          codeLine: 12,
          description: `${arr[mid]} < ${target}, search right half: left = ${mid + 1}`,
        });
        left = mid + 1;
      } else {
        steps.push({
          kind: 'search-left',
          payload: { left, oldRight: right, newRight: mid - 1, array: arr },
          codeLine: 14,
          description: `${arr[mid]} > ${target}, search left half: right = ${mid - 1}`,
        });
        right = mid - 1;
      }

      steps.push({
        kind: 'update-bounds',
        payload: { left, right, array: arr },
        codeLine: left > right ? 17 : 4,
        description: `Bounds updated: left=${left}, right=${right}`,
      });
    }

    steps.push({
      kind: 'not-found',
      payload: { target, array: arr },
      codeLine: 17,
      description: `${target} not found in array`,
    });

    return steps;
  },

  validateInput: (input: SearchingInput) => {
    if (!Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Please provide a non-empty array' };
    }
    // Check if sorted
    for (let i = 1; i < input.array.length; i++) {
      if (input.array[i] < input.array[i - 1]) {
        return { valid: false, error: 'Array must be sorted for binary search' };
      }
    }
    if (typeof input.target !== 'number') {
      return { valid: false, error: 'Target must be a number' };
    }
    return { valid: true };
  },
};
