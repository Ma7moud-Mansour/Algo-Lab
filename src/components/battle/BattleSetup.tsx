import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BattleSetupProps {
    algoA: string;
    algoB: string;
    setAlgoA: (val: string) => void;
    setAlgoB: (val: string) => void;
    inputSize: number;
    setInputSize: (val: number) => void;
    dataShape: string;
    setDataShape: (val: string) => void;
    onStart: () => void;
    isRunning: boolean;
    isPaused: boolean;
    onPause: () => void;
    onReset: () => void;
}

const ALGORITHMS = [
    // Sorting
    { value: 'bubble-sort', label: 'Bubble Sort', category: 'sorting' },
    { value: 'selection-sort', label: 'Selection Sort', category: 'sorting' },
    { value: 'insertion-sort', label: 'Insertion Sort', category: 'sorting' },
    { value: 'merge-sort', label: 'Merge Sort', category: 'sorting' },
    { value: 'quick-sort', label: 'Quick Sort', category: 'sorting' },
    // Searching
    { value: 'linear-search', label: 'Linear Search', category: 'searching' },
    { value: 'binary-search', label: 'Binary Search', category: 'searching' },
    // Graph
    { value: 'bfs', label: 'Breadth-First Search (BFS)', category: 'graph' },
    { value: 'dfs', label: 'Depth-First Search (DFS)', category: 'graph' },
    { value: 'bellman-ford', label: 'Bellman-Ford (Shortest Path)', category: 'graph' },
];

export function BattleSetup({
    algoA,
    algoB,
    setAlgoA,
    setAlgoB,
    inputSize,
    setInputSize,
    dataShape,
    setDataShape,
    onStart,
    isRunning,
    isPaused,
    onPause,
    onReset
}: BattleSetupProps) {
    const GRAPH_ALGOS = ['bfs', 'dfs', 'bellman-ford'];
    const hasGraphAlgo = GRAPH_ALGOS.includes(algoA) || GRAPH_ALGOS.includes(algoB);

    return (
        <div className="space-y-6 p-4 glass-panel rounded-xl border border-panel-border">
            <div className="flex items-center gap-2">
                <Zap className="text-primary w-5 h-5" />
                <h2 className="font-bold text-lg">Battle Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Algorithm A (Left)</Label>
                    <Select value={algoA} onValueChange={setAlgoA}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ALGORITHMS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Algorithm B (Right)</Label>
                    <Select value={algoB} onValueChange={setAlgoB}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ALGORITHMS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>{hasGraphAlgo ? `Nodes: ${Math.max(3, Math.min(12, Math.round(inputSize / 4)))}` : `Input Size: ${inputSize}`}</Label>
                        <span className="text-xs text-muted-foreground uppercase">Change One Thing Mode</span>
                    </div>
                    <Slider
                        value={[inputSize]}
                        onValueChange={(val) => setInputSize(val[0])}
                        min={5}
                        max={50}
                        step={5}
                        className="cursor-pointer"
                    />
                </div>

                {!hasGraphAlgo && (
                    <div className="space-y-2">
                        <Label>Data Shape</Label>
                        <div className="flex gap-2 flex-wrap">
                            {['random', 'sorted', 'reverse', 'nearly-sorted'].map(shape => (
                                <Button
                                    key={shape}
                                    variant={dataShape === shape ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setDataShape(shape)}
                                    className="capitalize"
                                >
                                    {shape.replace('-', ' ')}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {hasGraphAlgo && (
                    <div className="space-y-2">
                        <Label>Graph Info</Label>
                        <p className="text-xs text-muted-foreground">
                            A random connected graph is generated. Move the slider to change the number of nodes.
                        </p>
                    </div>
                )}
            </div>

            <div className="pt-2 flex gap-2">
                {!isRunning || isPaused ? (
                    <Button className="w-full" onClick={onStart}>
                        <Play className="w-4 h-4 mr-2" />
                        {isPaused ? "Resume Battle" : "Start Battle"}
                    </Button>
                ) : (
                    <Button className="w-full" variant="secondary" onClick={onPause}>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                    </Button>
                )}

                <Button variant="outline" size="icon" onClick={onReset} title="Reset">
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
