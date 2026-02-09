import { Navbar } from "@/components/layout/Navbar";
import { useLearningTest } from "@/hooks/useLearningTest";
import { TestSetup } from "@/components/learning-test/TestSetup";
import { TestResult } from "@/components/learning-test/TestResult";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SORTING_ALGORITHMS = [
    { id: 'bubble-sort', name: 'Bubble Sort', desc: 'Simple swapping, O(n²)' },
    { id: 'selection-sort', name: 'Selection Sort', desc: 'Find min, swap, O(n²)' },
    { id: 'insertion-sort', name: 'Insertion Sort', desc: 'Build sorted array, O(n²)' },
    { id: 'merge-sort', name: 'Merge Sort', desc: 'Divide & conquer, O(n log n)' },
    { id: 'quick-sort', name: 'Quick Sort', desc: 'Pivot partitioning, O(n log n)' },
];

const SEARCHING_ALGORITHMS = [
    { id: 'linear-search', name: 'Linear Search', desc: 'Check every item, O(n)' },
    { id: 'binary-search', name: 'Binary Search', desc: 'Split in half, O(log n) - Requires Sorted Input' },
];

const GRAPH_ALGORITHMS = [
    { id: 'bfs', name: 'Breadth-First Search', desc: 'Level by level traversal, O(V+E)' },
    { id: 'dfs', name: 'Depth-First Search', desc: 'Go deep then backtrack, O(V+E)' },
];

const BACKTRACKING_ALGORITHMS = [
    { id: 'n-queens', name: 'N-Queens', desc: 'Place queens safely, O(N!)' },
    { id: 'sudoku-solver', name: 'Sudoku Solver', desc: 'Fill grid with constraints' },
    { id: 'rat-maze', name: 'Rat in a Maze', desc: 'Find path through maze' },
    { id: 'knight-tour', name: "Knight's Tour", desc: 'Visit all squares once' },
    { id: 'tower-of-hanoi', name: 'Tower of Hanoi', desc: 'Move disks recursively, O(2^n)' },
];

const DP_ALGORITHMS = [
    { id: 'fibonacci', name: 'Fibonacci (DP)', desc: 'Memoized sequence, O(n)' },
    { id: 'knapsack-01', name: '0/1 Knapsack', desc: 'Maximize value with capacity, O(n×W)' },
    { id: 'lcs', name: 'Longest Common Subsequence', desc: 'Find common subsequence, O(m×n)' },
    { id: 'bellman-ford', name: 'Bellman-Ford', desc: 'Shortest paths, negative weights, O(V×E)' },
];

const GREEDY_ALGORITHMS = [
    { id: 'fractional-knapsack', name: 'Fractional Knapsack', desc: 'Take fractions, O(n log n)' },
    { id: 'optimal-merge', name: 'Optimal Merge Pattern', desc: 'Merge files at min cost' },
];

const ALGORITHMS: Record<string, typeof SORTING_ALGORITHMS> = {
    'sorting': SORTING_ALGORITHMS,
    'searching': SEARCHING_ALGORITHMS,
    'graph': GRAPH_ALGORITHMS,
    'backtracking': BACKTRACKING_ALGORITHMS,
    'dynamic-programming': DP_ALGORITHMS,
    'greedy': GREEDY_ALGORITHMS,
};

export default function LearningTest() {
    const {
        state,
        problem,
        result,
        userChoice,
        generateProblem,
        submitAnswer,
        nextProblem,
        currentTopic
    } = useLearningTest();

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar onMenuToggle={() => { }} />

            <main className="container mx-auto px-4 pt-20">

                {(state === 'setup' || state === 'loading') && (
                    <TestSetup onGenerate={generateProblem} isLoading={state === 'loading'} />
                )}



                {state === 'testing' && problem && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8">
                        <div className="text-center space-y-2">
                            <Badge variant="outline" className="text-xs uppercase tracking-widest mb-2">Challenge</Badge>
                            <h1 className="text-3xl font-bold">{problem.title}</h1>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Problem Card */}
                            <Card className="bg-secondary/5 border-secondary/20 h-full">
                                <CardHeader>
                                    <CardTitle>Scenario</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-lg leading-relaxed">{problem.description}</p>
                                    <div className="p-4 bg-background/50 rounded-lg border">
                                        <span className="text-xs font-mono text-muted-foreground block mb-2">INPUT DATA SAMPLE</span>
                                        <div className="font-mono text-sm break-all">
                                            [{problem.input.join(', ')}]
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Selection Grid */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Choose the Best Algorithm:</h3>
                                <div className="grid gap-3">
                                    {(ALGORITHMS[currentTopic] || ALGORITHMS['sorting']).map(algo => (
                                        <Button
                                            key={algo.id}
                                            variant="outline"
                                            className="h-auto py-4 justify-start text-left hover:border-primary hover:bg-primary/5 transition-all group"
                                            onClick={() => submitAnswer(algo.id)}
                                        >
                                            <div className="w-full">
                                                <div className="font-bold flex justify-between">
                                                    {algo.name}
                                                    <span className="text-xs font-normal text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Select
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">{algo.desc}</div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {state === 'result' && problem && userChoice && result && (
                    <TestResult
                        problem={problem}
                        userChoice={userChoice}
                        result={result}
                        onNext={nextProblem}
                    />
                )}

            </main>
        </div>
    );
}
