import { useState } from 'react';
import { Shuffle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface InputPanelProps {
  type: 'sorting' | 'searching';
  onInputChange: (input: Record<string, unknown>) => void;
  className?: string;
}

export function InputPanel({ type, onInputChange, className }: InputPanelProps) {
  const [arrayInput, setArrayInput] = useState('64, 34, 25, 12, 22, 11, 90');
  const [targetInput, setTargetInput] = useState('23');
  const [error, setError] = useState('');

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
    const array = parseArray(arrayInput);
    if (!array) {
      setError('Please enter valid comma-separated numbers');
      return;
    }

    setError('');
    
    if (type === 'searching') {
      const target = parseInt(targetInput.trim(), 10);
      if (isNaN(target)) {
        setError('Please enter a valid target number');
        return;
      }
      // Sort array for binary search
      const sortedArray = [...array].sort((a, b) => a - b);
      onInputChange({ array: sortedArray, target });
    } else {
      onInputChange({ array });
    }
  };

  const handleRandomize = () => {
    const length = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const arr = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setArrayInput(arr.join(', '));
    setError('');

    if (type === 'searching') {
      const sortedArr = [...arr].sort((a, b) => a - b);
      const randomTarget = sortedArr[Math.floor(Math.random() * sortedArr.length)];
      setTargetInput(randomTarget.toString());
      onInputChange({ array: sortedArr, target: randomTarget });
    } else {
      onInputChange({ array: arr });
    }
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

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <Button
          onClick={handleApply}
          className="w-full h-9 gap-2 bg-primary/80 hover:bg-primary"
        >
          Apply
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
