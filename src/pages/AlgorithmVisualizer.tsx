import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodePanel } from '@/components/visualizer/CodePanel';
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer';
import { ControlPanel } from '@/components/visualizer/ControlPanel';
import { LogPanel } from '@/components/visualizer/LogPanel';
import { AlgorithmInfo } from '@/components/visualizer/AlgorithmInfo';
import { InputPanel } from '@/components/visualizer/InputPanel';
import { LanguageTabs } from '@/components/visualizer/LanguageTabs';
import { useVisualizationEngine } from '@/hooks/useVisualizationEngine';
import { getAlgorithmById, getCategoryById } from '@/algorithms/config';
import { bubbleSortCode, selectionSortCode, quickSortCode, binarySearchCode } from '@/algorithms/code/sorting';
import { bubbleSortRunner, selectionSortRunner, quickSortRunner, SortingInput } from '@/algorithms/runners/sorting';
import { binarySearchRunner, SearchingInput } from '@/algorithms/runners/searching';
import { VisualizationStep, AlgorithmCode, AlgorithmRunner } from '@/types/algorithm';
import { cn } from '@/lib/utils';

// Map algorithm IDs to their code and runners
const algorithmCodeMap: Record<string, Record<string, AlgorithmCode>> = {
  'bubble-sort': bubbleSortCode,
  'selection-sort': selectionSortCode,
  'quick-sort': quickSortCode,
  'binary-search': binarySearchCode,
};

const algorithmRunnerMap: Record<string, AlgorithmRunner<SortingInput | SearchingInput>> = {
  'bubble-sort': bubbleSortRunner,
  'selection-sort': selectionSortRunner,
  'quick-sort': quickSortRunner,
  'binary-search': binarySearchRunner,
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

  // Initialize steps
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
      const generatedSteps = runner.generateSteps(input as unknown as SortingInput & SearchingInput);
      setSteps(generatedSteps);
    }
  }, [runner]);

  const {
    currentStep,
    executionState,
    speed,
    logs,
    run,
    pause,
    step,
    reset,
    setSpeed,
    progress,
  } = useVisualizationEngine({
    steps,
    onStepChange: (step) => {
      // Additional handling if needed
    },
  });

  const currentCode: AlgorithmCode = useMemo(() => {
    return codeMap[selectedLanguage] || codeMap['javascript'] || { language: 'javascript' as const, lines: ['// Code not available'] };
  }, [codeMap, selectedLanguage]);

  const availableLanguages = useMemo(() => {
    return Object.keys(codeMap);
  }, [codeMap]);

  if (!algorithm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center glass-panel p-8">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Algorithm Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested algorithm could not be found.
          </p>
          <Link to="/algorithms" className="text-primary hover:underline">
            Browse all algorithms
          </Link>
        </div>
      </div>
    );
  }

  const isSearching = category === 'searching';

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
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
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
              {algorithm.complexity.time.average}
            </Badge>
            <Badge variant="outline" className="bg-info/10 text-info border-info/30">
              {algorithm.complexity.space}
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground mt-2">{algorithm.description}</p>
      </header>

      {/* Language tabs */}
      <div className="mb-4">
        <LanguageTabs
          languages={availableLanguages}
          activeLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Left column: Code + Input */}
        <div className="space-y-4">
          <CodePanel
            code={currentCode}
            highlightedLine={currentStep?.codeLine}
            className="h-[400px]"
          />
          <InputPanel
            type={isSearching ? 'searching' : 'sorting'}
            onInputChange={handleInputChange}
          />
        </div>

        {/* Right column: Visualization + Controls */}
        <div className="space-y-4">
          <ArrayVisualizer
            currentStep={currentStep}
            className="h-[300px]"
          />
          <ControlPanel
            executionState={executionState}
            speed={speed}
            progress={progress}
            onRun={run}
            onPause={pause}
            onStep={step}
            onReset={reset}
            onSpeedChange={setSpeed}
          />
        </div>
      </div>

      {/* Bottom section: Logs + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
        <LogPanel logs={logs} className="h-[200px]" />
        <AlgorithmInfo algorithm={algorithm} />
      </div>
    </div>
  );
}
