import { useState } from 'react';
import { Shuffle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { generateSudokuPuzzle } from '@/lib/sudoku';
import { RealLifeUsageMaze } from './RealLifeUsageMaze';
import { RealLifeUsageBubble } from './RealLifeUsageBubble';
import { RealLifeUsageKnapsack } from './RealLifeUsageKnapsack';
import { RealLifeUsageClosestPair } from './RealLifeUsageClosestPair';
import { RealLifeUsageKnight } from './RealLifeUsageKnight';

interface InputPanelProps {
  type: 'sorting' | 'searching' | 'graph' | 'nqueens' | 'fibonacci' | 'hanoi' | 'closestpair' | 'knapsack' | 'mergepattern' | 'sudoku' | 'maze' | 'knight' | 'knapsack01' | 'lcs' | 'bellmanford';
  onInputChange: (input: Record<string, unknown>) => void;
  className?: string;
  algorithmId?: string;
}

export function InputPanel({ type, onInputChange, className, algorithmId }: InputPanelProps) {
  const [arrayInput, setArrayInput] = useState('64, 34, 25, 12, 22, 11, 90');
  const [targetInput, setTargetInput] = useState('23');
  const [numDisks, setNumDisks] = useState('4');
  const [numPoints, setNumPoints] = useState('8');
  const [knapsackCapacity, setKnapsackCapacity] = useState('50');
  const [knapsackItems, setKnapsackItems] = useState('10:60, 20:100, 30:120');
  const [fileSizes, setFileSizes] = useState('2, 3, 4, 5, 6');
  const [mazeSize, setMazeSize] = useState('5');
  const [knightSize, setKnightSize] = useState('5');
  const [str1, setStr1] = useState('ABCDGH');
  const [str2, setStr2] = useState('AEDFHR');
  const [k01Items, setK01Items] = useState('2:3, 3:4, 4:5, 5:6');
  const [k01Capacity, setK01Capacity] = useState('5');
  const [bfVertices, setBfVertices] = useState('5');
  const [bfEdges, setBfEdges] = useState('0-1:-1, 0-2:4, 1-2:3, 1-3:2, 1-4:2, 3-2:5, 3-1:1, 4-3:-3');
  const [bfSource, setBfSource] = useState('0');
  const [error, setError] = useState('');
  const [showRealLife, setShowRealLife] = useState(false);

  const parseArray = (input: string): number[] | null => {
    try {
      const arr = input.split(',').map(s => {
        const num = parseInt(s.trim(), 10);
        if (isNaN(num)) throw new Error('Invalid number');
        return num;
      });
      if (arr.length === 0) throw new Error('Empty array');
      return arr;
    } catch {
      return null;
    }
  };

  const handleApply = () => {
    setError('');

    if (type === 'hanoi') {
      const disks = parseInt(numDisks, 10);
      if (isNaN(disks) || disks < 1 || disks > 8) {
        setError('Number of disks must be between 1 and 8');
        return;
      }
      onInputChange({ numDisks: disks });
      return;
    }

    if (type === 'closestpair') {
      const count = parseInt(numPoints, 10);
      if (isNaN(count) || count < 2 || count > 20) {
        setError('Number of points must be between 2 and 20');
        return;
      }
      const points = Array.from({ length: count }, (_, i) => ({
        x: Math.floor(Math.random() * 300) + 30,
        y: Math.floor(Math.random() * 250) + 30,
        id: i,
      }));
      onInputChange({ points });
      return;
    }

    if (type === 'knapsack') {
      const capacity = parseInt(knapsackCapacity, 10);
      if (isNaN(capacity) || capacity <= 0) {
        setError('Capacity must be a positive number');
        return;
      }
      try {
        const items = knapsackItems.split(',').map(item => {
          const [weight, value] = item.trim().split(':').map(s => parseInt(s.trim(), 10));
          if (isNaN(weight) || isNaN(value)) throw new Error('Invalid format');
          return { weight, value };
        });
        if (items.length === 0) throw new Error('No items');
        onInputChange({ items, capacity });
      } catch {
        setError('Format: weight:value, weight:value (e.g., 10:60, 20:100)');
      }
      return;
    }

    if (type === 'mergepattern') {
      const sizes = parseArray(fileSizes);
      if (!sizes || sizes.length < 2) {
        setError('Enter at least 2 comma-separated file sizes');
        return;
      }
      onInputChange({ fileSizes: sizes });
      return;
    }

    if (type === 'sudoku') {
      // Use default puzzle - no custom input for now
      onInputChange({});
      return;
    }

    if (type === 'maze') {
      const size = parseInt(mazeSize, 10);
      if (isNaN(size) || size < 3 || size > 8) {
        setError('Maze size must be between 3 and 8');
        return;
      }
      // Generate random maze
      const maze = Array(size).fill(0).map(() => Array(size).fill(0).map(() => Math.random() > 0.3 ? 1 : 0));
      maze[0][0] = 1;
      maze[size - 1][size - 1] = 1;
      onInputChange({ maze, size });
      return;
    }

    if (type === 'knight') {
      const size = parseInt(knightSize, 10);
      if (isNaN(size) || size < 5 || size > 8) {
        setError('Board size must be between 5 and 8');
        return;
      }
      onInputChange({ size, startX: 0, startY: 0 });
      return;
    }

    if (type === 'knapsack01') {
      const capacity = parseInt(k01Capacity, 10);
      if (isNaN(capacity) || capacity <= 0 || capacity > 20) {
        setError('Capacity must be between 1 and 20');
        return;
      }
      try {
        const items = k01Items.split(',').map(item => {
          const [weight, value] = item.trim().split(':').map(s => parseInt(s.trim(), 10));
          if (isNaN(weight) || isNaN(value)) throw new Error('Invalid format');
          return { weight, value };
        });
        if (items.length === 0 || items.length > 8) throw new Error('1-8 items required');
        onInputChange({ weights: items.map(i => i.weight), values: items.map(i => i.value), capacity });
      } catch {
        setError('Format: weight:value, ... (e.g., 2:3, 3:4)');
      }
      return;
    }

    if (type === 'lcs') {
      if (str1.length === 0 || str1.length > 10 || str2.length === 0 || str2.length > 10) {
        setError('Strings must be 1-10 characters');
        return;
      }
      onInputChange({ str1: str1.toUpperCase(), str2: str2.toUpperCase() });
      return;
    }

    if (type === 'bellmanford') {
      const vertices = parseInt(bfVertices, 10);
      if (isNaN(vertices) || vertices < 2 || vertices > 8) {
        setError('Vertices must be between 2 and 8');
        return;
      }
      const source = parseInt(bfSource, 10);
      if (isNaN(source) || source < 0 || source >= vertices) {
        setError(`Source must be between 0 and ${vertices - 1}`);
        return;
      }
      try {
        const edges = bfEdges.split(',').map(e => {
          const [nodes, weight] = e.trim().split(':');
          const [u, v] = nodes.split('-').map(n => parseInt(n.trim(), 10));
          const w = parseInt(weight.trim(), 10);
          if (isNaN(u) || isNaN(v) || isNaN(w)) throw new Error('Invalid format');
          if (u < 0 || u >= vertices || v < 0 || v >= vertices) throw new Error('Invalid node');
          return { u, v, weight: w };
        });
        if (edges.length === 0) throw new Error('No edges');
        onInputChange({ vertices, edges, source });
      } catch {
        setError('Format: u-v:weight, ... (e.g., 0-1:4, 1-2:-1)');
      }
      return;
    }

    const array = parseArray(arrayInput);
    if (!array) {
      setError('Please enter valid comma-separated numbers');
      return;
    }

    if (type === 'searching') {
      const target = parseInt(targetInput.trim(), 10);
      if (isNaN(target)) {
        setError('Please enter a valid target number');
        return;
      }
      const sortedArray = [...array].sort((a, b) => a - b);
      onInputChange({ array: sortedArray, target });
    } else {
      onInputChange({ array });
    }
  };

  const handleRandomize = () => {
    setError('');

    if (type === 'hanoi') {
      const disks = Math.floor(Math.random() * 5) + 2;
      setNumDisks(disks.toString());
      onInputChange({ numDisks: disks });
      return;
    }

    if (type === 'closestpair') {
      const count = Math.floor(Math.random() * 10) + 5;
      setNumPoints(count.toString());
      const points = Array.from({ length: count }, (_, i) => ({
        x: Math.floor(Math.random() * 300) + 30,
        y: Math.floor(Math.random() * 250) + 30,
        id: i,
      }));
      onInputChange({ points });
      return;
    }

    if (type === 'knapsack') {
      const capacity = Math.floor(Math.random() * 50) + 30;
      setKnapsackCapacity(capacity.toString());
      const numItems = Math.floor(Math.random() * 4) + 3;
      const items = Array.from({ length: numItems }, () => ({
        weight: Math.floor(Math.random() * 20) + 5,
        value: Math.floor(Math.random() * 80) + 20,
      }));
      setKnapsackItems(items.map(i => `${i.weight}:${i.value}`).join(', '));
      onInputChange({ items, capacity });
      return;
    }

    if (type === 'mergepattern') {
      const numFiles = Math.floor(Math.random() * 4) + 4;
      const sizes = Array.from({ length: numFiles }, () => Math.floor(Math.random() * 20) + 2);
      setFileSizes(sizes.join(', '));
      onInputChange({ fileSizes: sizes });
      return;
    }

    if (type === 'sudoku') {
      const board = generateSudokuPuzzle();
      onInputChange({ board });
      return;
    }

    if (type === 'maze') {
      const size = Math.floor(Math.random() * 3) + 4;
      setMazeSize(size.toString());
      const maze = Array(size).fill(0).map(() => Array(size).fill(0).map(() => Math.random() > 0.3 ? 1 : 0));
      maze[0][0] = 1;
      maze[size - 1][size - 1] = 1;
      onInputChange({ maze, size });
      return;
    }

    if (type === 'knight') {
      const size = Math.floor(Math.random() * 3) + 5;
      setKnightSize(size.toString());
      onInputChange({ size, startX: 0, startY: 0 });
      return;
    }

    if (type === 'knapsack01') {
      const numItems = Math.floor(Math.random() * 4) + 3;
      const capacity = Math.floor(Math.random() * 8) + 5;
      setK01Capacity(capacity.toString());
      const items = Array.from({ length: numItems }, () => ({
        weight: Math.floor(Math.random() * 5) + 1,
        value: Math.floor(Math.random() * 10) + 1,
      }));
      setK01Items(items.map(i => `${i.weight}:${i.value}`).join(', '));
      onInputChange({ weights: items.map(i => i.weight), values: items.map(i => i.value), capacity });
      return;
    }

    if (type === 'lcs') {
      const chars = 'ABCDEFGH';
      const len1 = Math.floor(Math.random() * 4) + 4;
      const len2 = Math.floor(Math.random() * 4) + 4;
      const s1 = Array.from({ length: len1 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const s2 = Array.from({ length: len2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      setStr1(s1);
      setStr2(s2);
      onInputChange({ str1: s1, str2: s2 });
      return;
    }

    if (type === 'bellmanford') {
      const vertices = Math.floor(Math.random() * 4) + 4;
      setBfVertices(vertices.toString());
      const source = 0;
      setBfSource('0');
      const numEdges = Math.floor(Math.random() * 5) + vertices;
      const edges: Array<{ u: number; v: number; weight: number }> = [];
      for (let i = 0; i < numEdges; i++) {
        const u = Math.floor(Math.random() * vertices);
        let v = Math.floor(Math.random() * vertices);
        while (v === u) v = Math.floor(Math.random() * vertices);
        const weight = Math.floor(Math.random() * 15) - 5;
        edges.push({ u, v, weight });
      }
      setBfEdges(edges.map(e => `${e.u}-${e.v}:${e.weight}`).join(', '));
      onInputChange({ vertices, edges, source });
      return;
    }

    const length = Math.floor(Math.random() * 6) + 5;
    const arr = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setArrayInput(arr.join(', '));

    if (type === 'searching') {
      const sortedArr = [...arr].sort((a, b) => a - b);
      const randomTarget = sortedArr[Math.floor(Math.random() * sortedArr.length)];
      setTargetInput(randomTarget.toString());
      onInputChange({ array: sortedArr, target: randomTarget });
    } else {
      onInputChange({ array: arr });
    }
  };

  const renderInputFields = () => {
    if (type === 'hanoi') {
      return (
        <div className="space-y-1.5">
          <Label htmlFor="disks-input" className="text-xs text-muted-foreground">
            Number of Disks (1-8)
          </Label>
          <Input
            id="disks-input"
            value={numDisks}
            onChange={(e) => setNumDisks(e.target.value)}
            placeholder="e.g., 4"
            className="font-mono text-sm bg-muted/50 border-panel-border w-32"
          />
        </div>
      );
    }

    if (type === 'closestpair') {
      return (
        <div className="space-y-1.5">
          <Label htmlFor="points-input" className="text-xs text-muted-foreground">
            Number of Points (2-20)
          </Label>
          <Input
            id="points-input"
            value={numPoints}
            onChange={(e) => setNumPoints(e.target.value)}
            placeholder="e.g., 8"
            className="font-mono text-sm bg-muted/50 border-panel-border w-32"
          />
        </div>
      );
    }

    if (type === 'knapsack') {
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="capacity-input" className="text-xs text-muted-foreground">
              Knapsack Capacity
            </Label>
            <Input
              id="capacity-input"
              value={knapsackCapacity}
              onChange={(e) => setKnapsackCapacity(e.target.value)}
              placeholder="e.g., 50"
              className="font-mono text-sm bg-muted/50 border-panel-border w-32"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="items-input" className="text-xs text-muted-foreground">
              Items (weight:value, ...)
            </Label>
            <Input
              id="items-input"
              value={knapsackItems}
              onChange={(e) => setKnapsackItems(e.target.value)}
              placeholder="e.g., 10:60, 20:100"
              className="font-mono text-sm bg-muted/50 border-panel-border"
            />
          </div>
        </div>
      );
    }

    if (type === 'mergepattern') {
      return (
        <div className="space-y-1.5">
          <Label htmlFor="files-input" className="text-xs text-muted-foreground">
            File Sizes (comma-separated)
          </Label>
          <Input
            id="files-input"
            value={fileSizes}
            onChange={(e) => setFileSizes(e.target.value)}
            placeholder="e.g., 2, 3, 4, 5, 6"
            className="font-mono text-sm bg-muted/50 border-panel-border"
          />
        </div>
      );
    }

    if (type === 'sudoku') {
      return (
        <p className="text-xs text-muted-foreground">
          Click Randomize to generate a new Sudoku puzzle.
        </p>
      );
    }

    if (type === 'maze') {
      return (
        <div className="space-y-1.5">
          <Label htmlFor="maze-input" className="text-xs text-muted-foreground">
            Maze Size (3-8)
          </Label>
          <Input
            id="maze-input"
            value={mazeSize}
            onChange={(e) => setMazeSize(e.target.value)}
            placeholder="e.g., 5"
            className="font-mono text-sm bg-muted/50 border-panel-border w-32"
          />
        </div>
      );
    }

    if (type === 'knight') {
      return (
        <div className="space-y-1.5">
          <Label htmlFor="knight-input" className="text-xs text-muted-foreground">
            Board Size (5-8)
          </Label>
          <Input
            id="knight-input"
            value={knightSize}
            onChange={(e) => setKnightSize(e.target.value)}
            placeholder="e.g., 5"
            className="font-mono text-sm bg-muted/50 border-panel-border w-32"
          />
        </div>
      );
    }

    if (type === 'knapsack01') {
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="k01-capacity" className="text-xs text-muted-foreground">Capacity (1-20)</Label>
            <Input id="k01-capacity" value={k01Capacity} onChange={(e) => setK01Capacity(e.target.value)} className="font-mono text-sm bg-muted/50 border-panel-border w-32" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="k01-items" className="text-xs text-muted-foreground">Items (weight:value, ...)</Label>
            <Input id="k01-items" value={k01Items} onChange={(e) => setK01Items(e.target.value)} className="font-mono text-sm bg-muted/50 border-panel-border" />
          </div>
        </div>
      );
    }

    if (type === 'lcs') {
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="lcs-str1" className="text-xs text-muted-foreground">String 1 (1-10 chars)</Label>
            <Input id="lcs-str1" value={str1} onChange={(e) => setStr1(e.target.value.toUpperCase())} className="font-mono text-sm bg-muted/50 border-panel-border" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lcs-str2" className="text-xs text-muted-foreground">String 2 (1-10 chars)</Label>
            <Input id="lcs-str2" value={str2} onChange={(e) => setStr2(e.target.value.toUpperCase())} className="font-mono text-sm bg-muted/50 border-panel-border" />
          </div>
        </div>
      );
    }

    if (type === 'bellmanford') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bf-vertices" className="text-xs text-muted-foreground">Vertices (2-8)</Label>
              <Input id="bf-vertices" value={bfVertices} onChange={(e) => setBfVertices(e.target.value)} className="font-mono text-sm bg-muted/50 border-panel-border" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bf-source" className="text-xs text-muted-foreground">Source</Label>
              <Input id="bf-source" value={bfSource} onChange={(e) => setBfSource(e.target.value)} className="font-mono text-sm bg-muted/50 border-panel-border" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bf-edges" className="text-xs text-muted-foreground">Edges (u-v:weight, ...)</Label>
            <Input id="bf-edges" value={bfEdges} onChange={(e) => setBfEdges(e.target.value)} className="font-mono text-sm bg-muted/50 border-panel-border" />
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-1.5">
          <Label htmlFor="array-input" className="text-xs text-muted-foreground">
            Array (comma-separated)
          </Label>
          <Input
            id="array-input"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="e.g., 64, 34, 25, 12, 22"
            className="font-mono text-sm bg-muted/50 border-panel-border"
          />
        </div>
        {type === 'searching' && (
          <div className="space-y-1.5">
            <Label htmlFor="target-input" className="text-xs text-muted-foreground">
              Target Value
            </Label>
            <Input
              id="target-input"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="e.g., 23"
              className="font-mono text-sm bg-muted/50 border-panel-border w-32"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className={cn('glass-panel p-4 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Input Configuration</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRandomize}
          className="h-8 gap-1.5 text-xs border-panel-border hover:border-secondary hover:text-secondary"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Randomize
        </Button>
      </div>

      <div className="space-y-3">
        {renderInputFields()}
        {error && <p className="text-xs text-destructive">{error}</p>}
        {type !== 'sudoku' && (
          <Button onClick={handleApply} className="w-full h-9 gap-2 bg-primary/80 hover:bg-primary">
            Apply
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        {type === 'maze' && (
          <>
            <Button
              onClick={() => setShowRealLife(!showRealLife)}
              variant="outline"
              className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              شوف الخوارزمية دي في الحياة الواقعية
            </Button>

            {showRealLife && <RealLifeUsageMaze />}
          </>
        )}

        {algorithmId === 'bubble-sort' && (
          <>
            <Button
              onClick={() => setShowRealLife(!showRealLife)}
              variant="outline"
              className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              شوف الخوارزمية دي في الحياة الواقعية
            </Button>

            {showRealLife && <RealLifeUsageBubble />}
          </>
        )}

        {(algorithmId === 'fractional-knapsack' || algorithmId === 'knapsack-01') && (
          <>
            <Button
              onClick={() => setShowRealLife(!showRealLife)}
              variant="outline"
              className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              شوف الخوارزمية دي في الحياة الواقعية
            </Button>

            {showRealLife && <RealLifeUsageKnapsack />}
          </>
        )}

        {algorithmId === 'closest-pair' && (
          <>
            <Button
              onClick={() => setShowRealLife(!showRealLife)}
              variant="outline"
              className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              شوف الخوارزمية دي في الحياة الواقعية
            </Button>

            {showRealLife && <RealLifeUsageClosestPair />}
          </>
        )}

        {algorithmId === 'knight-tour' && (
          <>
            <Button
              onClick={() => setShowRealLife(!showRealLife)}
              variant="outline"
              className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              شوف الخوارزمية دي في الحياة الواقعية
            </Button>

            {showRealLife && <RealLifeUsageKnight />}
          </>
        )}
      </div>
    </div>
  );
}
