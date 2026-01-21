export type DecisionNode = {
    id: string;
    type: 'question';
    question: string;
    options: {
        label: string;
        nextId: string;
    }[];
};

export type DecisionResult = {
    id: string;
    type: 'result';
    algorithm: string;
    description: string;
    why: string;
    whyNot: string[];
    links: {
        visualizer?: string;
        battle?: string;
        learning?: string;
    };
};

export type DecisionStep = DecisionNode | DecisionResult;

export const algorithmDecisionData: Record<string, DecisionStep> = {
    // ROOT
    root: {
        id: 'root',
        type: 'question',
        question: 'What type of problem are you solving?',
        options: [
            { label: 'Sorting (Ordering data)', nextId: 'sorting_root' },
            { label: 'Searching (Finding data)', nextId: 'searching_root' },
            { label: 'Graph (Networks, Paths)', nextId: 'graph_root' },
            { label: 'Optimization (Max/Min)', nextId: 'optimization_root' },
            { label: 'Recursion (Subproblems)', nextId: 'recursion_root' },
        ],
    },

    // --- SORTING ---
    sorting_root: {
        id: 'sorting_root',
        type: 'question',
        question: 'What is the size of your dataset?',
        options: [
            { label: 'Small (< 50 items)', nextId: 'small_size' },
            { label: 'Large (>= 50 items)', nextId: 'large_size' },
        ],
    },
    small_size: {
        id: 'small_size',
        type: 'question',
        question: 'Is the data already mostly sorted?',
        options: [
            { label: 'Yes, mostly sorted', nextId: 'insertion_sort' },
            { label: 'No, random order', nextId: 'is_memory_critical_small' },
        ],
    },
    is_memory_critical_small: {
        id: 'is_memory_critical_small',
        type: 'question',
        question: 'Is memory usage critical?',
        options: [
            { label: 'Yes, need O(1) space', nextId: 'selection_sort' },
            { label: 'No, speed is more important', nextId: 'bubble_sort' },
        ],
    },
    large_size: {
        id: 'large_size',
        type: 'question',
        question: 'Do you need a stable sort? (Preserve order of equal elements)',
        options: [
            { label: 'Yes, stability is required', nextId: 'merge_sort' },
            { label: 'No, stability does not matter', nextId: 'memory_check_large' },
        ],
    },
    memory_check_large: {
        id: 'memory_check_large',
        type: 'question',
        question: 'Is memory usage a strict constraint?',
        options: [
            { label: 'Yes, minimize memory (O(1) extra space)', nextId: 'heap_sort' },
            { label: 'No, standard memory available', nextId: 'quick_sort' },
        ],
    },

    // --- SEARCHING ---
    searching_root: {
        id: 'searching_root',
        type: 'question',
        question: 'Is your data collection sorted?',
        options: [
            { label: 'Yes, it is sorted', nextId: 'binary_search' },
            { label: 'No, it is unsorted', nextId: 'searching_frequency' },
        ],
    },
    searching_frequency: {
        id: 'searching_frequency',
        type: 'question',
        question: 'Will you perform many searches on this dataset?',
        options: [
            { label: 'Yes, many searches (preprocess)', nextId: 'hash_table' },
            { label: 'No, just a few searches', nextId: 'linear_search' },
        ],
    },

    // --- GRAPH ---
    graph_root: {
        id: 'graph_root',
        type: 'question',
        question: 'What is your goal?',
        options: [
            { label: 'Find Shortest Path', nextId: 'graph_weighted' },
            { label: 'Traverse/Visit all nodes', nextId: 'graph_traversal' },
        ],
    },
    graph_weighted: {
        id: 'graph_weighted',
        type: 'question',
        question: 'Is the graph weighted (edges have costs)?',
        options: [
            { label: 'Yes, weighted edges', nextId: 'graph_negative' },
            { label: 'No, unweighted edges', nextId: 'bfs' },
        ],
    },
    graph_negative: {
        id: 'graph_negative',
        type: 'question',
        question: 'Are there negative edge weights?',
        options: [
            { label: 'Yes, negative weights exist', nextId: 'bellman_ford' },
            { label: 'No, all positive', nextId: 'dijkstra' },
        ],
    },
    graph_traversal: {
        id: 'graph_traversal',
        type: 'question',
        question: 'Do you need to explore deep paths or detect cycles?',
        options: [
            { label: 'Depth/Cycle Detection', nextId: 'dfs' },
            { label: 'Level by Level', nextId: 'bfs' },
        ],
    },

    // --- OPTIMIZATION ---
    optimization_root: {
        id: 'optimization_root',
        type: 'question',
        question: 'Can you solve the problem by making the best local choice at each step?',
        options: [
            { label: 'Yes (Greedy Property)', nextId: 'greedy' },
            { label: 'No, need to check all combinations', nextId: 'opt_subproblems' },
        ],
    },
    opt_subproblems: {
        id: 'opt_subproblems',
        type: 'question',
        question: 'Does the problem have overlapping subproblems?',
        options: [
            { label: 'Yes, same subproblems recur', nextId: 'dynamic_programming' },
            { label: 'No, distinctive subproblems', nextId: 'backtracking' },
        ],
    },

    // --- RECURSION ---
    recursion_root: {
        id: 'recursion_root',
        type: 'question',
        question: 'Can the problem be divided into independent smaller subproblems?',
        options: [
            { label: 'Yes (e.g. Merge Sort style)', nextId: 'divide_and_conquer' },
            { label: 'No, depends on previous state', nextId: 'standard_recursion' },
        ],
    },


    // === RESULTS ===

    // Sorting Results
    insertion_sort: {
        id: 'insertion_sort',
        type: 'result',
        algorithm: 'Insertion Sort',
        description: 'Builds the final sorted array one item at a time.',
        why: 'Efficient for small or mostly sorted data.',
        whyNot: ['Merge/Quick Sort: Too much overhead for small data.'],
        links: { visualizer: '/algorithms/sorting/insertion-sort', learning: '/learning-test?algorithm=insertion-sort' }
    },
    selection_sort: {
        id: 'selection_sort',
        type: 'result',
        algorithm: 'Selection Sort',
        description: 'Repeatedly finds the minimum element.',
        why: 'Minimizes memory writes and uses O(1) space.',
        whyNot: ['Bubble Sort: More swaps.'],
        links: { visualizer: '/algorithms/sorting/selection-sort', learning: '/learning-test?algorithm=selection-sort' }
    },
    bubble_sort: {
        id: 'bubble_sort',
        type: 'result',
        algorithm: 'Bubble Sort',
        description: 'Repeatedly swaps adjacent elements.',
        why: 'Simple to implement for very small datasets.',
        whyNot: ['Insertion Sort: Usually faster.'],
        links: { visualizer: '/algorithms/sorting/bubble-sort', learning: '/learning-test?algorithm=bubble-sort' }
    },
    merge_sort: {
        id: 'merge_sort',
        type: 'result',
        algorithm: 'Merge Sort',
        description: 'Stable divide and conquer algorithm.',
        why: 'Guarantees O(n log n) and stability.',
        whyNot: ['Quick Sort: Not stable.'],
        links: { visualizer: '/algorithms/sorting/merge-sort', learning: '/learning-test?algorithm=merge-sort' }
    },
    heap_sort: {
        id: 'heap_sort',
        type: 'result',
        algorithm: 'Heap Sort',
        description: 'Comparison-based sort using Heap structure.',
        why: 'O(n log n) with O(1) extra space.',
        whyNot: ['Merge Sort: Uses O(n) space.'],
        links: { visualizer: '/algorithms/sorting/heap-sort', learning: '/learning-test?algorithm=heap-sort' }
    },
    quick_sort: {
        id: 'quick_sort',
        type: 'result',
        algorithm: 'Quick Sort',
        description: 'Efficient divide and conquer sort.',
        why: 'Generally fastest in practice (O(n log n)).',
        whyNot: ['Merge Sort: Uses more memory.'],
        links: { visualizer: '/algorithms/sorting/quick-sort', learning: '/learning-test?algorithm=quick-sort' }
    },

    // Searching Results
    binary_search: {
        id: 'binary_search',
        type: 'result',
        algorithm: 'Binary Search',
        description: 'Finds position of a target value within a sorted array.',
        why: 'O(log n) efficiency is unbeatable for sorted arrays.',
        whyNot: ['Linear Search: O(n) is much slower.'],
        links: { visualizer: '/algorithms/searching/binary-search', learning: '/learning-test?algorithm=binary-search' }
    },
    linear_search: {
        id: 'linear_search',
        type: 'result',
        algorithm: 'Linear Search',
        description: 'Checks every element until the desired one is found.',
        why: 'Data is unsorted and you only search once, so preprocessing is not worth it.',
        whyNot: ['Binary Search: Requires sorted data.'],
        links: { visualizer: '/algorithms/searching/linear-search', learning: '/learning-test?algorithm=linear-search' }
    },
    hash_table: {
        id: 'hash_table',
        type: 'result',
        algorithm: 'Hash Table (Pre-processing)',
        description: 'Map keys to values for efficient lookup.',
        why: 'For repeated searches, O(1) average lookup justifies the O(n) setup cost.',
        whyNot: ['Linear Search: Too slow for many queries.'],
        links: {} // Add link if available
    },

    // Graph Results
    bfs: {
        id: 'bfs',
        type: 'result',
        algorithm: 'Breadth-First Search (BFS)',
        description: 'Explores neighbor nodes first, before moving to the next level neighbors.',
        why: 'Guarantees shortest path in unweighted graphs.',
        whyNot: ['DFS: Does not guarantee shortest path.'],
        links: { visualizer: '/algorithms/graph/bfs', learning: '/learning-test?algorithm=bfs' }
    },
    dfs: {
        id: 'dfs',
        type: 'result',
        algorithm: 'Depth-First Search (DFS)',
        description: 'Explores as far as possible along each branch before backtracking.',
        why: 'Good for traversal, cycle detection, and topological sorting.',
        whyNot: ['BFS: Uses more memory for wide graphs.'],
        links: { visualizer: '/algorithms/graph/dfs', learning: '/learning-test?algorithm=dfs' }
    },
    dijkstra: {
        id: 'dijkstra',
        type: 'result',
        algorithm: 'Dijkstra\'s Algorithm',
        description: 'Finds the shortest paths between nodes in a graph.',
        why: 'Handles positive edge weights correctly.',
        whyNot: ['BFS: Ignores weights.'],
        links: { visualizer: '/algorithms/graph/dijkstra', learning: '/learning-test?algorithm=dijkstra' }
    },
    bellman_ford: {
        id: 'bellman_ford',
        type: 'result',
        algorithm: 'Bellman-Ford Algorithm',
        description: 'Computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph.',
        why: 'Can handle negative edge weights.',
        whyNot: ['Dijkstra: Fails with negative edges.'],
        links: {}
    },

    // Optimization Results
    greedy: {
        id: 'greedy',
        type: 'result',
        algorithm: 'Greedy Algorithm',
        description: 'Makes the locally optimal choice at each stage.',
        why: 'Problem satisfies greedy-choice property (e.g., Activity Selection, Huffman Coding).',
        whyNot: ['Dynamic Programming: Overkill if greedy works.'],
        links: {}
    },
    dynamic_programming: {
        id: 'dynamic_programming',
        type: 'result',
        algorithm: 'Dynamic Programming',
        description: 'Breaks down problem into simpler subproblems and stores solutions.',
        why: 'Overlapping subproblems exist (e.g., Knapsack, Fibonacci).',
        whyNot: ['Divide & Conquer: Re-calculates same subproblems.'],
        links: { visualizer: '/algorithms/dp', learning: '/learning-test?algorithm=dp' }
    },
    backtracking: {
        id: 'backtracking',
        type: 'result',
        algorithm: 'Backtracking',
        description: 'Finds solution by trying all possibilities and abandoning invalid ones.',
        why: 'Need to explore all combinations/permutations (e.g. N-Queens).',
        whyNot: ['Greedy: Cannot look ahead.'],
        links: {}
    },

    // Recursion Results
    divide_and_conquer: {
        id: 'divide_and_conquer',
        type: 'result',
        algorithm: 'Divide and Conquer',
        description: 'Divides problem into disjoint subproblems.',
        why: 'Subproblems are independent (e.g. Merge Sort).',
        whyNot: ['Dynamic Programming: Subproblems overlap.'],
        links: {}
    },
    standard_recursion: {
        id: 'standard_recursion',
        type: 'result',
        algorithm: 'Standard Recursion',
        description: 'Function calls itself to solve smaller instances.',
        why: 'Natural fit for hierarchical data (Trees) or defined recurrence.',
        whyNot: ['Iteration: Code might be more complex.'],
        links: {}
    }
};
