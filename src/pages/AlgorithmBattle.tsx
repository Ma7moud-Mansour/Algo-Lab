import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useTheme } from '@/hooks/use-theme';
import { BattleSetup } from '@/components/battle/BattleSetup';
import { BattleStats } from '@/components/battle/BattleStats';
import { useBattleEngine } from '@/hooks/useBattleEngine';
import { getBattleInput } from '@/lib/battle-utils';
import { bubbleSortRunner, selectionSortRunner, insertionSortRunner, mergeSortRunner, quickSortRunner, SortingInput } from '@/algorithms/runners/sorting';
import { linearSearchRunner, binarySearchRunner, SearchingInput } from '@/algorithms/runners/searching';
import { bfsRunner, dfsRunner, GraphInput } from '@/algorithms/runners/graph';
import { bellmanFordRunner, BellmanFordInput } from '@/algorithms/runners/bellmanford';
import { AlgorithmRunner, VisualizationStep } from '@/types/algorithm';
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer';
import { GraphVisualizer } from '@/components/visualizer/GraphVisualizer';
import { BellmanFordVisualizer } from '@/components/visualizer/BellmanFordVisualizer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Info, MapPin } from 'lucide-react';

// Combined input type for different algorithm types
type BattleInput = { array: number[]; target?: number };

// Algorithm category detection
const GRAPH_ALGORITHMS = ['bfs', 'dfs'];
const BELLMAN_FORD_ALGORITHMS = ['bellman-ford'];
const isGraphAlgo = (algo: string) => GRAPH_ALGORITHMS.includes(algo);
const isBellmanFordAlgo = (algo: string) => BELLMAN_FORD_ALGORITHMS.includes(algo);
const isGraphLikeAlgo = (algo: string) => isGraphAlgo(algo) || isBellmanFordAlgo(algo);

const RUNNERS_MAP: Record<string, AlgorithmRunner<any>> = {
    // Sorting
    'bubble-sort': bubbleSortRunner,
    'selection-sort': selectionSortRunner,
    'insertion-sort': insertionSortRunner,
    'merge-sort': mergeSortRunner,
    'quick-sort': quickSortRunner,
    // Searching
    'linear-search': linearSearchRunner,
    'binary-search': binarySearchRunner,
    // Graph
    'bfs': bfsRunner,
    'dfs': dfsRunner,
    // Weighted Graph
    'bellman-ford': bellmanFordRunner,
};

// Generate a dynamic graph based on node count
function generateGraphInput(nodeCount: number): GraphInput {
    // Clamp between 3 and 12 nodes for graph visualization
    const count = Math.max(3, Math.min(12, Math.round(nodeCount / 4)));
    const nodes = Array.from({ length: count }, (_, i) => i);
    const edges: [number, number][] = [];

    // First ensure connectivity: create a spanning tree
    for (let i = 1; i < count; i++) {
        const parent = Math.floor(Math.random() * i);
        edges.push([parent, i]);
    }

    // Add some extra random edges for complexity
    const extraEdges = Math.floor(count * 0.6);
    for (let e = 0; e < extraEdges; e++) {
        const a = Math.floor(Math.random() * count);
        const b = Math.floor(Math.random() * count);
        if (a !== b && !edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
            edges.push([a, b]);
        }
    }

    return { nodes, edges, startNode: 0 };
}

// Generate a dynamic weighted graph for Bellman-Ford
function generateBellmanFordInput(nodeCount: number): BellmanFordInput {
    const vertices = Math.max(3, Math.min(8, Math.round(nodeCount / 5)));
    const edges: Array<{ u: number; v: number; weight: number }> = [];

    // Create a spanning tree for connectivity
    for (let i = 1; i < vertices; i++) {
        const parent = Math.floor(Math.random() * i);
        const weight = Math.floor(Math.random() * 15) - 3; // Weights from -3 to 11
        edges.push({ u: parent, v: i, weight });
    }

    // Add extra random edges
    const extraEdges = Math.floor(vertices * 0.5);
    for (let e = 0; e < extraEdges; e++) {
        const u = Math.floor(Math.random() * vertices);
        const v = Math.floor(Math.random() * vertices);
        if (u !== v && !edges.some(edge => edge.u === u && edge.v === v)) {
            const weight = Math.floor(Math.random() * 15) - 3;
            edges.push({ u, v, weight });
        }
    }

    return { vertices, edges, source: 0 };
}

export default function AlgorithmBattle() {
    const { theme } = useTheme(); // Ensuring theme context is active if needed for child components
    const [algoA, setAlgoA] = useState('bubble-sort');
    const [algoB, setAlgoB] = useState('quick-sort');
    const [inputSize, setInputSize] = useState(20);
    const [dataShape, setDataShape] = useState('random');

    const [inputData, setInputData] = useState<BattleInput>({ array: [] });

    // Keep track of the steps independently so they update when *Configuration* changes
    const [stepsA, setStepsA] = useState<VisualizationStep[]>([]);
    const [stepsB, setStepsB] = useState<VisualizationStep[]>([]);

    // Helper to check if algorithm is a searching algorithm
    const isSearchAlgo = (algo: string) => algo.includes('search');

    // Initialize or Update Input on Config Change ("Change One Thing" Mode)
    useEffect(() => {
        const newData = getBattleInput(dataShape as any, inputSize);

        // For searching algorithms, we need a sorted array and a target
        let arrayForSearch = [...newData.array];
        if (isSearchAlgo(algoA) || isSearchAlgo(algoB)) {
            arrayForSearch = [...newData.array].sort((a, b) => a - b); // Binary search needs sorted array
        }

        // Pick a random target from the array for searching
        const target = arrayForSearch[Math.floor(arrayForSearch.length / 2)];

        setInputData({ array: newData.array, target });

        // Generate steps for each algorithm with appropriate input
        const runnerA = RUNNERS_MAP[algoA];
        const runnerB = RUNNERS_MAP[algoB];

        if (runnerA && runnerB) {
            // Generate graph input based on inputSize (shared so both graph algos race on same graph)
            const graphInput = generateGraphInput(inputSize);
            const bfInput = generateBellmanFordInput(inputSize);

            // Determine input type based on algorithm category
            const getInput = (algo: string) => {
                if (isBellmanFordAlgo(algo)) {
                    return bfInput;
                } else if (isGraphAlgo(algo)) {
                    return graphInput;
                } else if (isSearchAlgo(algo)) {
                    return { array: arrayForSearch, target };
                } else {
                    return { array: [...newData.array] };
                }
            };

            setStepsA(runnerA.generateSteps(getInput(algoA)));
            setStepsB(runnerB.generateSteps(getInput(algoB)));
        }
    }, [inputSize, dataShape, algoA, algoB]);

    const {
        currentStepA,
        currentStepB,
        currentStepIndexA,
        currentStepIndexB,
        executionState,
        winner,
        progressA,
        progressB,
        run,
        pause,
        reset,
        step
    } = useBattleEngine({
        stepsA,
        stepsB,
        speed: 'normal'
    });

    // Effect to auto-reset engine when input changes deeply?
    // Actually useBattleEngine resets when steps length changes significantly or we can force it.
    // The hook does `useEffect(() => stepsRef.current = steps, [steps])` but doesn't auto-reset execution index 
    // unless we tell it to. For "Change One Thing", we probably want to reset to start 
    // if the user moves the slider, OR we can try to "Hot Swap" but that's complex for algorithms.
    // Let's AUTO-RESET on config change to be safe and clear.
    useEffect(() => {
        reset();
    }, [stepsA, stepsB, reset]);


    return (
        <div className="min-h-screen bg-background">
            <Navbar onMenuToggle={() => { }} showMenuButton={false} />

            <main className="container mx-auto px-4 pt-20 pb-12">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Algorithm Battle Arena
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Compare algorithms side-by-side. See how they race, analyze their memory usage, and understand why one is faster than the other.
                    </p>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4">
                                <MapPin className="mr-2 h-4 w-4" />
                                Where is this used in real life?
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Real World Applications</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold text-primary mb-1">Sorting (Bubble, Insertion)</h3>
                                    <p className="text-sm">Used in educational contexts and for very small datasets where code simplicity is preferred over speed.</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold text-secondary mb-1">Efficient Sorts (Quick, Merge)</h3>
                                    <p className="text-sm">Powering database indexing, e-commerce product listings, and large-scale data processing systems.</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold text-green-600 mb-1">Searching (Linear, Binary)</h3>
                                    <p className="text-sm">Binary Search powers dictionary lookups, spell checkers, and database queries. Linear Search is used when data is unsorted.</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold text-blue-500 mb-1">Graph Traversal (BFS, DFS)</h3>
                                    <p className="text-sm">BFS finds shortest paths in GPS navigation. DFS powers maze solving, web crawlers, and social network relationship analysis.</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold text-orange-500 mb-1">Bellman-Ford (Shortest Path)</h3>
                                    <p className="text-sm">Handles negative edge weights for currency exchange arbitrage detection, network routing protocols (RIP), and traffic optimization.</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Controls & Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        <BattleSetup
                            algoA={algoA}
                            algoB={algoB}
                            setAlgoA={setAlgoA}
                            setAlgoB={setAlgoB}
                            inputSize={inputSize}
                            setInputSize={setInputSize}
                            dataShape={dataShape}
                            setDataShape={setDataShape}
                            onStart={run}
                            isRunning={executionState === 'running'}
                            isPaused={executionState === 'paused'}
                            onPause={pause}
                            onReset={reset}
                        />

                        <BattleStats
                            algorithmA={algoA}
                            algorithmB={algoB}
                            stepsA={currentStepIndexA + 1}
                            stepsB={currentStepIndexB + 1}
                            inputSize={inputSize}
                            progressA={progressA}
                            progressB={progressB}
                            showMemory={true}
                        />

                        {winner && (
                            <div className="p-4 border-2 border-primary/50 bg-primary/10 rounded-xl animate-in fade-in zoom-in duration-500 text-center">
                                <h3 className="text-xl font-bold text-primary mb-2">
                                    {winner === 'Tie' ? "It's a Tie!" : `Winner: Algorithm ${winner}`}
                                </h3>
                                <p className="text-sm text-foreground/80">
                                    {winner === 'A' ? algoA : (winner === 'B' ? algoB : "Both")} finished sorting first!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: The Arena */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Arena A */}
                        <div className="relative group">
                            <div className="absolute top-2 left-2 z-10">
                                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded shadow-sm">
                                    Algorithm A: {algoA}
                                </span>
                            </div>
                            <div className="border border-primary/20 rounded-xl overflow-hidden bg-card/50 shadow-sm min-h-[300px] p-4">
                                {isBellmanFordAlgo(algoA) ? (
                                    <BellmanFordVisualizer
                                        currentStep={currentStepA || null}
                                        className="h-[280px]"
                                    />
                                ) : isGraphAlgo(algoA) ? (
                                    <GraphVisualizer
                                        currentStep={currentStepA || { kind: 'init', payload: { nodes: [0, 1, 2, 3, 4, 5], edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5]] } }}
                                        className="h-[280px]"
                                    />
                                ) : (
                                    <ArrayVisualizer
                                        currentStep={currentStepA || { kind: 'init', payload: { array: inputData.array || [] } }}
                                        className="h-[280px]"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Arena B */}
                        <div className="relative group">
                            <div className="absolute top-2 left-2 z-10">
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded shadow-sm">
                                    Algorithm B: {algoB}
                                </span>
                            </div>
                            <div className="border border-secondary/20 rounded-xl overflow-hidden bg-card/50 shadow-sm min-h-[300px] p-4">
                                {isBellmanFordAlgo(algoB) ? (
                                    <BellmanFordVisualizer
                                        currentStep={currentStepB || null}
                                        className="h-[280px]"
                                    />
                                ) : isGraphAlgo(algoB) ? (
                                    <GraphVisualizer
                                        currentStep={currentStepB || { kind: 'init', payload: { nodes: [0, 1, 2, 3, 4, 5], edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5]] } }}
                                        className="h-[280px]"
                                    />
                                ) : (
                                    <ArrayVisualizer
                                        currentStep={currentStepB || { kind: 'init', payload: { array: inputData.array || [] } }}
                                        className="h-[280px]"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
