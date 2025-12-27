import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodePanel } from '@/components/visualizer/CodePanel';
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer';
import { GraphVisualizer } from '@/components/visualizer/GraphVisualizer';
import { GridVisualizer } from '@/components/visualizer/GridVisualizer';
import { DPVisualizer } from '@/components/visualizer/DPVisualizer';
import { HanoiVisualizer } from '@/components/visualizer/HanoiVisualizer';
import { ClosestPairVisualizer } from '@/components/visualizer/ClosestPairVisualizer';
import { KnapsackVisualizer } from '@/components/visualizer/KnapsackVisualizer';
import { MergePatternVisualizer } from '@/components/visualizer/MergePatternVisualizer';
import { SudokuVisualizer } from '@/components/visualizer/SudokuVisualizer';
import { MazeVisualizer } from '@/components/visualizer/MazeVisualizer';
import { KnightVisualizer } from '@/components/visualizer/KnightVisualizer';
import { Knapsack01Visualizer } from '@/components/visualizer/Knapsack01Visualizer';
import { LCSVisualizer } from '@/components/visualizer/LCSVisualizer';
import { BellmanFordVisualizer } from '@/components/visualizer/BellmanFordVisualizer';
import { ControlPanel } from '@/components/visualizer/ControlPanel';
import { LogPanel } from '@/components/visualizer/LogPanel';
import { AlgorithmInfo } from '@/components/visualizer/AlgorithmInfo';
import { InputPanel } from '@/components/visualizer/InputPanel';
import { LanguageTabs } from '@/components/visualizer/LanguageTabs';
import { useVisualizationEngine } from '@/hooks/useVisualizationEngine';
import { AskAlgorithm } from '@/components/AskAlgorithm';
import { getAlgorithmById, getCategoryById } from '@/algorithms/config';
import { bubbleSortCode, selectionSortCode, quickSortCode, insertionSortCode, mergeSortCode } from '@/algorithms/code/sorting';
import { linearSearchCode, binarySearchCode } from '@/algorithms/code/searching';
import { bfsCode, dfsCode } from '@/algorithms/code/graph';
import { nQueensCode } from '@/algorithms/code/backtracking';
import { fibonacciCode } from '@/algorithms/code/dynamic';
import { hanoiCode } from '@/algorithms/code/hanoi';
import { closestPairCode } from '@/algorithms/code/closestpair';
import { fractionalKnapsackCode, optimalMergeCode } from '@/algorithms/code/greedy';
import { sudokuCode } from '@/algorithms/code/sudoku';
import { ratMazeCode } from '@/algorithms/code/maze';
import { knightTourCode } from '@/algorithms/code/knight';
import { knapsack01Code } from '@/algorithms/code/knapsack01';
import { lcsCode } from '@/algorithms/code/lcs';
import { bellmanFordCode } from '@/algorithms/code/bellmanford';
import { bubbleSortRunner, selectionSortRunner, quickSortRunner, insertionSortRunner, mergeSortRunner, SortingInput } from '@/algorithms/runners/sorting';
import { linearSearchRunner, binarySearchRunner, SearchingInput } from '@/algorithms/runners/searching';
import { bfsRunner, dfsRunner, GraphInput } from '@/algorithms/runners/graph';
import { nQueensRunner, NQueensInput } from '@/algorithms/runners/backtracking';
import { fibonacciRunner, FibonacciInput } from '@/algorithms/runners/dynamic';
import { hanoiRunner, HanoiInput } from '@/algorithms/runners/hanoi';
import { closestPairRunner, ClosestPairInput } from '@/algorithms/runners/closestpair';
import { fractionalKnapsackRunner, optimalMergeRunner, FractionalKnapsackInput, OptimalMergeInput } from '@/algorithms/runners/greedy';
import { sudokuRunner, SudokuInput } from '@/algorithms/runners/sudoku';
import { ratMazeRunner, MazeInput } from '@/algorithms/runners/maze';
import { knightTourRunner, KnightInput } from '@/algorithms/runners/knight';
import { knapsack01Runner, Knapsack01Input } from '@/algorithms/runners/knapsack01';
import { lcsRunner, LCSInput } from '@/algorithms/runners/lcs';
import { bellmanFordRunner, BellmanFordInput } from '@/algorithms/runners/bellmanford';
import { VisualizationStep, AlgorithmCode, AlgorithmRunner } from '@/types/algorithm';
import { cn } from '@/lib/utils';

type AnyInput = SortingInput | SearchingInput | GraphInput | NQueensInput | FibonacciInput | HanoiInput | ClosestPairInput | FractionalKnapsackInput | OptimalMergeInput | SudokuInput | MazeInput | KnightInput | Knapsack01Input | LCSInput | BellmanFordInput;

const algorithmCodeMap: Record<string, Record<string, AlgorithmCode>> = {
  'bubble-sort': bubbleSortCode,
  'selection-sort': selectionSortCode,
  'insertion-sort': insertionSortCode,
  'merge-sort': mergeSortCode,
  'quick-sort': quickSortCode,
  'linear-search': linearSearchCode,
  'binary-search': binarySearchCode,
  'bfs': bfsCode,
  'dfs': dfsCode,
  'n-queens': nQueensCode,
  'fibonacci': fibonacciCode,
  'tower-of-hanoi': hanoiCode,
  'closest-pair': closestPairCode,
  'fractional-knapsack': fractionalKnapsackCode,
  'optimal-merge': optimalMergeCode,
  'sudoku-solver': sudokuCode,
  'rat-maze': ratMazeCode,
  'knight-tour': knightTourCode,
  'knapsack-01': knapsack01Code,
  'lcs': lcsCode,
  'bellman-ford': bellmanFordCode,
};

const algorithmRunnerMap: Record<string, AlgorithmRunner<AnyInput>> = {
  'bubble-sort': bubbleSortRunner as AlgorithmRunner<AnyInput>,
  'selection-sort': selectionSortRunner as AlgorithmRunner<AnyInput>,
  'insertion-sort': insertionSortRunner as AlgorithmRunner<AnyInput>,
  'merge-sort': mergeSortRunner as AlgorithmRunner<AnyInput>,
  'quick-sort': quickSortRunner as AlgorithmRunner<AnyInput>,
  'linear-search': linearSearchRunner as AlgorithmRunner<AnyInput>,
  'binary-search': binarySearchRunner as AlgorithmRunner<AnyInput>,
  'bfs': bfsRunner as AlgorithmRunner<AnyInput>,
  'dfs': dfsRunner as AlgorithmRunner<AnyInput>,
  'n-queens': nQueensRunner as AlgorithmRunner<AnyInput>,
  'fibonacci': fibonacciRunner as AlgorithmRunner<AnyInput>,
  'tower-of-hanoi': hanoiRunner as AlgorithmRunner<AnyInput>,
  'closest-pair': closestPairRunner as AlgorithmRunner<AnyInput>,
  'fractional-knapsack': fractionalKnapsackRunner as AlgorithmRunner<AnyInput>,
  'optimal-merge': optimalMergeRunner as AlgorithmRunner<AnyInput>,
  'sudoku-solver': sudokuRunner as AlgorithmRunner<AnyInput>,
  'rat-maze': ratMazeRunner as AlgorithmRunner<AnyInput>,
  'knight-tour': knightTourRunner as AlgorithmRunner<AnyInput>,
  'knapsack-01': knapsack01Runner as AlgorithmRunner<AnyInput>,
  'lcs': lcsRunner as AlgorithmRunner<AnyInput>,
  'bellman-ford': bellmanFordRunner as AlgorithmRunner<AnyInput>,
};

const getVisualizerType = (category: string, id: string): 'array' | 'graph' | 'grid' | 'dp' | 'hanoi' | 'closestpair' | 'knapsack' | 'mergepattern' | 'sudoku' | 'maze' | 'knight' | 'knapsack01' | 'lcs' | 'bellmanford' => {
  if (id === 'tower-of-hanoi') return 'hanoi';
  if (id === 'closest-pair') return 'closestpair';
  if (id === 'fractional-knapsack') return 'knapsack';
  if (id === 'optimal-merge') return 'mergepattern';
  if (id === 'sudoku-solver') return 'sudoku';
  if (id === 'rat-maze') return 'maze';
  if (id === 'knight-tour') return 'knight';
  if (id === 'knapsack-01') return 'knapsack01';
  if (id === 'lcs') return 'lcs';
  if (id === 'bellman-ford') return 'bellmanford';
  if (id === 'n-queens') return 'grid';
  if (category === 'graph') return 'graph';
  if (category === 'dynamic-programming') return 'dp';
  return 'array';
};

export default function AlgorithmVisualizer() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({});

  const algorithm = useMemo(() => getAlgorithmById(id || ''), [id]);
  const categoryInfo = useMemo(() => getCategoryById(category || ''), [category]);
  const codeMap = useMemo(() => algorithmCodeMap[id || ''] || {}, [id]);
  const runner = useMemo(() => algorithmRunnerMap[id || ''], [id]);
  const visualizerType = useMemo(() => getVisualizerType(category || '', id || ''), [category, id]);

  useEffect(() => {
    if (runner) {
      const initialInput = runner.getInitialInput();
      setCurrentInput(initialInput as unknown as Record<string, unknown>);
      const generatedSteps = runner.generateSteps(initialInput);
      setSteps(generatedSteps);
    }
  }, [runner]);

  const handleInputChange = useCallback((input: Record<string, unknown>) => {
    if (runner) {
      setCurrentInput(input);
      const generatedSteps = runner.generateSteps(input as unknown as AnyInput);
      setSteps(generatedSteps);
    }
  }, [runner]);

  const {
    currentStep,
    currentStepIndex,
    executionState,
    speed,
    logs,
    run,
    pause,
    step,
    stepBack,
    reset,
    setSpeed,
    goToStep,
    progress,
    totalSteps,
  } = useVisualizationEngine({ steps });

  const currentCode: AlgorithmCode = useMemo(() => {
    return codeMap[selectedLanguage] || codeMap['javascript'] || codeMap['pseudocode'] || { language: 'pseudocode' as const, lines: ['// Algorithm implementation'] };
  }, [codeMap, selectedLanguage]);

  const availableLanguages = useMemo(() => Object.keys(codeMap), [codeMap]);

  if (!algorithm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center glass-panel p-8">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Algorithm Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested algorithm could not be found.</p>
          <Link to="/algorithms" className="text-primary hover:underline">Browse all algorithms</Link>
        </div>
      </div>
    );
  }

  const inputType = id === 'tower-of-hanoi' ? 'hanoi' : id === 'closest-pair' ? 'closestpair' : id === 'fractional-knapsack' ? 'knapsack' : id === 'optimal-merge' ? 'mergepattern' : id === 'sudoku-solver' ? 'sudoku' : id === 'rat-maze' ? 'maze' : id === 'knight-tour' ? 'knight' : id === 'knapsack-01' ? 'knapsack01' : id === 'lcs' ? 'lcs' : id === 'bellman-ford' ? 'bellmanford' : category === 'searching' ? 'searching' : category === 'graph' ? 'graph' : category === 'backtracking' ? 'nqueens' : category === 'dynamic-programming' ? 'fibonacci' : 'sorting';

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/algorithms" className="hover:text-foreground transition-colors">Algorithms</Link>
          <ChevronRight className="h-4 w-4" />
          {categoryInfo && (
            <>
              <span className="text-foreground capitalize">{categoryInfo.name}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-primary">{algorithm.name}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{algorithm.name}</h1>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">{algorithm.complexity.time.average}</Badge>
            <Badge variant="outline" className="bg-info/10 text-info border-info/30">{algorithm.complexity.space}</Badge>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">{algorithm.description}</p>

        <AskAlgorithm algorithmName={algorithm.name} />
      </header>

      <div className="mb-4">
        <LanguageTabs languages={availableLanguages} activeLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <CodePanel code={currentCode} highlightedLine={currentStep?.codeLine} className="h-[400px]" />
          <InputPanel type={inputType} onInputChange={handleInputChange} algorithmId={id} />
        </div>
        <div className="space-y-4">
          {visualizerType === 'array' && <ArrayVisualizer currentStep={currentStep} className="h-[300px]" />}
          {visualizerType === 'graph' && <GraphVisualizer currentStep={currentStep} className="h-[300px]" />}
          {visualizerType === 'grid' && <GridVisualizer currentStep={currentStep} className="h-[300px]" />}
          {visualizerType === 'dp' && <DPVisualizer currentStep={currentStep} className="h-[300px]" />}
          {visualizerType === 'hanoi' && (
            <HanoiVisualizer currentStep={currentStep} className="min-h-[320px]" />
          )}
          {visualizerType === 'closestpair' && <ClosestPairVisualizer currentStep={currentStep} className="h-[300px]" />}
          {visualizerType === 'knapsack' && <KnapsackVisualizer currentStep={currentStep} className="h-[300px]" />}
          {visualizerType === 'mergepattern' && <MergePatternVisualizer currentStep={currentStep} className="h-[300px]" />}
          {visualizerType === 'sudoku' && (
            <SudokuVisualizer
              currentStep={currentStep}
              initialBoard={(currentInput as SudokuInput)?.board}
              className="min-h-[320px]"
            />
          )}
          {visualizerType === 'maze' && (
            <MazeVisualizer currentStep={currentStep} className="min-h-[300px]" />
          )}
          {visualizerType === 'knight' && (
            <KnightVisualizer
              currentStep={currentStep}
              onStartPositionChange={(x, y) => {
                const size = (currentInput as { size?: number }).size || 5;
                handleInputChange({ size, startX: x, startY: y });
              }}
              className="min-h-[300px]"
            />
          )}
          {visualizerType === 'knapsack01' && (
            <Knapsack01Visualizer currentStep={currentStep} className="min-h-[320px]" />
          )}
          {visualizerType === 'lcs' && (
            <LCSVisualizer currentStep={currentStep} className="min-h-[320px]" />
          )}
          {visualizerType === 'bellmanford' && (
            <BellmanFordVisualizer currentStep={currentStep} className="min-h-[350px]" />
          )}
          <ControlPanel
            executionState={executionState}
            speed={speed}
            progress={progress}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            onRun={run}
            onPause={pause}
            onStep={step}
            onStepBack={stepBack}
            onReset={reset}
            onSpeedChange={setSpeed}
            onGoToStep={goToStep}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
        <LogPanel logs={logs} className="h-[200px]" />
        <AlgorithmInfo algorithm={algorithm} />
      </div>
    </div>
  );
}