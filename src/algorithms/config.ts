import { AlgorithmDefinition, CategoryInfo } from '@/types/algorithm';

export const categories: CategoryInfo[] = [
  {
    id: 'sorting',
    name: 'Sorting',
    description: 'Algorithms that arrange elements in a specific order',
    icon: 'ArrowUpDown',
    color: 'primary',
  },
  {
    id: 'searching',
    name: 'Searching',
    description: 'Algorithms to find elements in data structures',
    icon: 'Search',
    color: 'secondary',
  },
  {
    id: 'graph',
    name: 'Graph',
    description: 'Algorithms for traversing and analyzing graphs',
    icon: 'GitBranch',
    color: 'info',
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Fundamental data organization methods',
    icon: 'Database',
    color: 'success',
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    description: 'Systematic search with pruning',
    icon: 'Undo2',
    color: 'warning',
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    description: 'Optimization by breaking down into subproblems',
    icon: 'Layers',
    color: 'primary',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Miscellaneous algorithms and techniques',
    icon: 'Sparkles',
    color: 'secondary',
  },
];

export const algorithms: AlgorithmDefinition[] = [
  // Sorting Algorithms
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    route: '/algorithms/sorting/bubble-sort',
    description: 'Simple comparison-based sorting algorithm that repeatedly steps through the list.',
    longDescription: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    tags: ['comparison', 'stable', 'in-place'],
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    supportedLanguages: ['javascript', 'python', 'cpp', 'pseudocode'],
    useCases: ['Educational purposes', 'Small datasets', 'Nearly sorted data'],
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    route: '/algorithms/sorting/selection-sort',
    description: 'Sorts by repeatedly finding the minimum element from the unsorted portion.',
    longDescription: 'Selection Sort divides the input list into a sorted and unsorted region, and repeatedly selects the smallest element from the unsorted region to move to the sorted region.',
    tags: ['comparison', 'unstable', 'in-place'],
    complexity: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    supportedLanguages: ['javascript', 'python', 'cpp', 'pseudocode'],
    useCases: ['Small datasets', 'Memory-constrained environments'],
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    route: '/algorithms/sorting/insertion-sort',
    description: 'Builds the sorted array one item at a time by inserting elements.',
    tags: ['comparison', 'stable', 'in-place', 'adaptive'],
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    supportedLanguages: ['javascript', 'python', 'cpp', 'pseudocode'],
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    route: '/algorithms/sorting/quick-sort',
    description: 'Efficient divide-and-conquer algorithm using partitioning.',
    longDescription: 'Quick Sort works by selecting a pivot element and partitioning the array around it. Elements smaller than the pivot go to the left, larger to the right, then recursively sort the subarrays.',
    tags: ['divide-and-conquer', 'unstable', 'in-place'],
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n)',
    },
    supportedLanguages: ['javascript', 'python', 'cpp', 'pseudocode'],
    useCases: ['General purpose sorting', 'Large datasets', 'Cache efficiency'],
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    route: '/algorithms/sorting/merge-sort',
    description: 'Divide and conquer algorithm that splits array and merges sorted halves.',
    tags: ['divide-and-conquer', 'stable', 'not-in-place'],
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
    },
    supportedLanguages: ['javascript', 'python', 'cpp', 'pseudocode'],
  },
  // Searching Algorithms
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    route: '/algorithms/searching/linear-search',
    description: 'Simple search that checks every element sequentially.',
    tags: ['sequential', 'simple'],
    complexity: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
    },
    supportedLanguages: ['javascript', 'python', 'cpp', 'pseudocode'],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    route: '/algorithms/searching/binary-search',
    description: 'Efficient search on sorted arrays by repeatedly halving the search space.',
    longDescription: 'Binary Search finds the position of a target value within a sorted array by comparing the target to the middle element and eliminating half of the remaining elements at each step.',
    tags: ['divide-and-conquer', 'sorted-input'],
    complexity: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
    },
    supportedLanguages: ['javascript', 'python', 'cpp', 'pseudocode'],
    useCases: ['Sorted arrays', 'Database indexing', 'Dictionary lookups'],
  },
  // Graph Algorithms
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    route: '/algorithms/graph/bfs',
    description: 'Explores all vertices at the present depth before moving to vertices at the next depth.',
    tags: ['traversal', 'shortest-path'],
    complexity: {
      time: { average: 'O(V + E)', worst: 'O(V + E)' },
      space: 'O(V)',
    },
    supportedLanguages: ['javascript', 'python', 'pseudocode'],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    route: '/algorithms/graph/dfs',
    description: 'Explores as far as possible along each branch before backtracking.',
    tags: ['traversal', 'backtracking'],
    complexity: {
      time: { average: 'O(V + E)', worst: 'O(V + E)' },
      space: 'O(V)',
    },
    supportedLanguages: ['javascript', 'python', 'pseudocode'],
  },
  // Backtracking
  {
    id: 'n-queens',
    name: 'N-Queens',
    category: 'backtracking',
    route: '/algorithms/backtracking/n-queens',
    description: 'Place N queens on an N×N chessboard so no two queens attack each other.',
    tags: ['constraint-satisfaction', 'puzzle'],
    complexity: {
      time: { average: 'O(N!)', worst: 'O(N!)' },
      space: 'O(N)',
    },
    supportedLanguages: ['javascript', 'python', 'pseudocode'],
  },
  // Dynamic Programming
  {
    id: 'fibonacci',
    name: 'Fibonacci (DP)',
    category: 'dynamic-programming',
    route: '/algorithms/dynamic-programming/fibonacci',
    description: 'Compute Fibonacci numbers using memoization.',
    tags: ['memoization', 'optimization'],
    complexity: {
      time: { average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    supportedLanguages: ['javascript', 'python', 'pseudocode'],
  },
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    category: 'backtracking',
    route: '/algorithms/backtracking/tower-of-hanoi',
    description: 'Classic recursive puzzle moving disks between three rods.',
    longDescription: 'The Tower of Hanoi is a mathematical puzzle where you have three rods and N disks of different sizes. The objective is to move all disks from the first rod to the third, following rules: only one disk can be moved at a time, and a larger disk cannot be placed on top of a smaller disk.',
    tags: ['recursion', 'puzzle', 'divide-and-conquer'],
    complexity: {
      time: { average: 'O(2^n)', worst: 'O(2^n)' },
      space: 'O(n)',
    },
    supportedLanguages: ['javascript', 'python', 'pseudocode'],
    useCases: ['Teaching recursion', 'Understanding call stack', 'Algorithm visualization'],
  },
  {
    id: 'closest-pair',
    name: 'Closest Pair of Points',
    category: 'other',
    route: '/algorithms/other/closest-pair',
    description: 'Find the two closest points in a set using brute force.',
    longDescription: 'The Closest Pair of Points problem finds the pair of points with the smallest Euclidean distance. This brute force approach compares all pairs with O(n²) complexity.',
    tags: ['geometry', 'brute-force', 'computational-geometry'],
    complexity: {
      time: { average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    supportedLanguages: ['javascript', 'python', 'pseudocode'],
    useCases: ['Computational geometry', 'Collision detection', 'Nearest neighbor problems'],
  },
];

export const getAlgorithmsByCategory = (category: string): AlgorithmDefinition[] => {
  return algorithms.filter(algo => algo.category === category);
};

export const getAlgorithmById = (id: string): AlgorithmDefinition | undefined => {
  return algorithms.find(algo => algo.id === id);
};

export const getCategoryById = (id: string): CategoryInfo | undefined => {
  return categories.find(cat => cat.id === id);
};
