export type AlgorithmCategory = 
  | 'sorting' 
  | 'searching' 
  | 'graph' 
  | 'data-structures'
  | 'backtracking' 
  | 'dynamic-programming' 
  | 'greedy'
  | 'other';

export interface AlgorithmComplexity {
  time: {
    best?: string;
    average: string;
    worst: string;
  };
  space: string;
}

export interface AlgorithmCode {
  language: 'javascript' | 'python' | 'cpp' | 'pseudocode';
  lines: string[];
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  category: AlgorithmCategory;
  route: string;
  description: string;
  longDescription?: string;
  tags: string[];
  complexity: AlgorithmComplexity;
  supportedLanguages: ('javascript' | 'python' | 'cpp' | 'pseudocode')[];
  useCases?: string[];
}

export interface VisualizationStep {
  kind: string;
  payload: Record<string, unknown>;
  codeLine?: number;
  description?: string;
  delayMs?: number;
}

export interface AlgorithmRunner<TInput = unknown> {
  getInitialInput: () => TInput;
  generateSteps: (input: TInput) => VisualizationStep[];
  validateInput?: (input: TInput) => { valid: boolean; error?: string };
}

export interface CategoryInfo {
  id: AlgorithmCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export type ExecutionState = 'idle' | 'running' | 'paused' | 'completed';
export type ExecutionSpeed = 'slow' | 'normal' | 'fast';
