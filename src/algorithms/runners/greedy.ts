import { AlgorithmRunner, VisualizationStep } from '@/types/algorithm';

export interface KnapsackItem {
  weight: number;
  value: number;
}

export interface FractionalKnapsackInput {
  items: KnapsackItem[];
  capacity: number;
  [key: string]: unknown;
}

export interface OptimalMergeInput {
  fileSizes: number[];
  [key: string]: unknown;
}

export const fractionalKnapsackRunner: AlgorithmRunner<FractionalKnapsackInput> = {
  getInitialInput: () => ({
    items: [
      { weight: 10, value: 60 },
      { weight: 20, value: 100 },
      { weight: 30, value: 120 },
    ],
    capacity: 50,
  }),

  generateSteps: (input: FractionalKnapsackInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const { items, capacity } = input;

    // Initial state
    steps.push({
      kind: 'init',
      payload: {
        items: items.map((item, i) => ({
          ...item,
          index: i,
          ratio: item.value / item.weight,
          status: 'pending',
          fraction: 0,
        })),
        capacity,
        remainingCapacity: capacity,
        totalValue: 0,
      },
      codeLine: 1,
      description: `Initialize knapsack with capacity ${capacity}`,
    });

    // Calculate ratios
    const itemsWithRatio = items.map((item, i) => ({
      ...item,
      index: i,
      ratio: item.value / item.weight,
      status: 'pending' as string,
      fraction: 0,
    }));

    steps.push({
      kind: 'calculate-ratios',
      payload: {
        items: itemsWithRatio.map(item => ({ ...item })),
        capacity,
        remainingCapacity: capacity,
        totalValue: 0,
      },
      codeLine: 3,
      description: 'Calculate value-to-weight ratio for each item',
    });

    // Sort by ratio
    const sortedItems = [...itemsWithRatio].sort((a, b) => b.ratio - a.ratio);

    steps.push({
      kind: 'sort',
      payload: {
        items: sortedItems.map(item => ({ ...item })),
        capacity,
        remainingCapacity: capacity,
        totalValue: 0,
      },
      codeLine: 9,
      description: 'Sort items by ratio in descending order',
    });

    let totalValue = 0;
    let remainingCapacity = capacity;
    const result = sortedItems.map(item => ({ ...item }));

    // Process each item
    for (let i = 0; i < result.length; i++) {
      const item = result[i];

      if (remainingCapacity === 0) {
        steps.push({
          kind: 'skip',
          payload: {
            items: result.map(it => ({ ...it })),
            currentIndex: i,
            capacity,
            remainingCapacity,
            totalValue,
          },
          codeLine: 16,
          description: `Knapsack is full, skipping remaining items`,
        });
        result[i].status = 'skipped';
        continue;
      }

      // Consider item
      steps.push({
        kind: 'consider',
        payload: {
          items: result.map(it => ({ ...it })),
          currentIndex: i,
          capacity,
          remainingCapacity,
          totalValue,
        },
        codeLine: 15,
        description: `Considering item ${item.index + 1}: weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(2)}`,
      });

      if (item.weight <= remainingCapacity) {
        // Take whole item
        result[i].status = 'full';
        result[i].fraction = 1;
        totalValue += item.value;
        remainingCapacity -= item.weight;

        steps.push({
          kind: 'take-full',
          payload: {
            items: result.map(it => ({ ...it })),
            currentIndex: i,
            capacity,
            remainingCapacity,
            totalValue,
          },
          codeLine: 19,
          description: `Taking whole item ${item.index + 1}: +${item.value} value, capacity left: ${remainingCapacity}`,
        });
      } else if (remainingCapacity > 0) {
        // Take fraction
        const fraction = remainingCapacity / item.weight;
        result[i].status = 'partial';
        result[i].fraction = fraction;
        totalValue += item.value * fraction;
        remainingCapacity = 0;

        steps.push({
          kind: 'take-partial',
          payload: {
            items: result.map(it => ({ ...it })),
            currentIndex: i,
            capacity,
            remainingCapacity,
            totalValue,
            fraction,
          },
          codeLine: 24,
          description: `Taking ${(fraction * 100).toFixed(1)}% of item ${item.index + 1}: +${(item.value * fraction).toFixed(2)} value`,
        });
      }
    }

    // Mark remaining as skipped
    for (let i = 0; i < result.length; i++) {
      if (result[i].status === 'pending') {
        result[i].status = 'skipped';
      }
    }

    // Final state
    steps.push({
      kind: 'complete',
      payload: {
        items: result,
        capacity,
        remainingCapacity,
        totalValue,
      },
      codeLine: 31,
      description: `Completed! Total value: ${totalValue.toFixed(2)}`,
    });

    return steps;
  },
};

export const optimalMergeRunner: AlgorithmRunner<OptimalMergeInput> = {
  getInitialInput: () => ({
    fileSizes: [2, 3, 4, 5, 6],
  }),

  generateSteps: (input: OptimalMergeInput): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const { fileSizes } = input;

    if (fileSizes.length <= 1) {
      steps.push({
        kind: 'complete',
        payload: { heap: fileSizes, totalCost: 0, mergeHistory: [] },
        codeLine: 2,
        description: 'Only one file, no merging needed',
      });
      return steps;
    }

    // Initial state
    let heap = [...fileSizes].sort((a, b) => a - b);
    let nodeIdCounter = 0;
    let nodes = heap.map((size, i) => ({
      id: nodeIdCounter++,
      size,
      merged: false,
      active: false,
    }));

    steps.push({
      kind: 'init',
      payload: {
        heap: [...heap],
        nodes: nodes.map(n => ({ ...n })),
        totalCost: 0,
        mergeHistory: [],
      },
      codeLine: 4,
      description: `Initialize min-heap with ${fileSizes.length} files`,
    });

    let totalCost = 0;
    const mergeHistory: Array<{ first: number; second: number; result: number; cost: number }> = [];

    while (heap.length > 1) {
      // Highlight two smallest
      const first = heap[0];
      const second = heap[1];

      const firstNodeIdx = nodes.findIndex(n => n.size === first && !n.merged);
      const secondNodeIdx = nodes.findIndex(n => n.size === second && !n.merged && n.id !== nodes[firstNodeIdx]?.id);

      if (firstNodeIdx >= 0) nodes[firstNodeIdx].active = true;
      if (secondNodeIdx >= 0) nodes[secondNodeIdx].active = true;

      steps.push({
        kind: 'select',
        payload: {
          heap: [...heap],
          nodes: nodes.map(n => ({ ...n })),
          totalCost,
          selected: [first, second],
          mergeHistory: [...mergeHistory],
        },
        codeLine: 9,
        description: `Select two smallest files: ${first} and ${second}`,
      });

      // Extract and merge
      heap.shift();
      heap.shift();
      const mergeCost = first + second;
      totalCost += mergeCost;

      // Mark as merged
      if (firstNodeIdx >= 0) {
        nodes[firstNodeIdx].merged = true;
        nodes[firstNodeIdx].active = false;
      }
      if (secondNodeIdx >= 0) {
        nodes[secondNodeIdx].merged = true;
        nodes[secondNodeIdx].active = false;
      }

      // Add merged node
      nodes.push({
        id: nodeIdCounter++,
        size: mergeCost,
        merged: false,
        active: true,
      });

      mergeHistory.push({ first, second, result: mergeCost, cost: mergeCost });

      steps.push({
        kind: 'merge',
        payload: {
          heap: [...heap],
          nodes: nodes.map(n => ({ ...n })),
          totalCost,
          mergeCost,
          mergeHistory: [...mergeHistory],
        },
        codeLine: 13,
        description: `Merge files: ${first} + ${second} = ${mergeCost}, cost added: ${mergeCost}`,
      });

      // Insert back into heap
      let insertIndex = 0;
      while (insertIndex < heap.length && heap[insertIndex] < mergeCost) {
        insertIndex++;
      }
      heap.splice(insertIndex, 0, mergeCost);

      // Reset active states
      nodes = nodes.map(n => ({ ...n, active: false }));

      steps.push({
        kind: 'insert',
        payload: {
          heap: [...heap],
          nodes: nodes.map(n => ({ ...n })),
          totalCost,
          mergeHistory: [...mergeHistory],
        },
        codeLine: 21,
        description: `Insert merged file (${mergeCost}) back into heap`,
      });
    }

    // Final state
    steps.push({
      kind: 'complete',
      payload: {
        heap: [...heap],
        nodes: nodes.map(n => ({ ...n })),
        totalCost,
        mergeHistory,
      },
      codeLine: 25,
      description: `Completed! Total merge cost: ${totalCost}`,
    });

    return steps;
  },
};
