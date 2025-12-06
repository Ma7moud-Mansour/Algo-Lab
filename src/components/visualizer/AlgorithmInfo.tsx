import { Clock, HardDrive, Tag, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlgorithmDefinition } from '@/types/algorithm';

interface AlgorithmInfoProps {
  algorithm: AlgorithmDefinition;
  className?: string;
}

export function AlgorithmInfo({ algorithm, className }: AlgorithmInfoProps) {
  return (
    <div className={cn('glass-panel p-4 space-y-4', className)}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{algorithm.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {algorithm.longDescription || algorithm.description}
          </p>
        </div>
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Time Complexity</span>
          </div>
          <div className="space-y-1 text-sm">
            {algorithm.complexity.time.best && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best:</span>
                <Badge variant="outline" className="font-mono text-xs bg-success/10 text-success border-success/30">
                  {algorithm.complexity.time.best}
                </Badge>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average:</span>
              <Badge variant="outline" className="font-mono text-xs bg-secondary/10 text-secondary border-secondary/30">
                {algorithm.complexity.time.average}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Worst:</span>
              <Badge variant="outline" className="font-mono text-xs bg-destructive/10 text-destructive border-destructive/30">
                {algorithm.complexity.time.worst}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HardDrive className="h-3.5 w-3.5" />
            <span>Space Complexity</span>
          </div>
          <div className="pt-1">
            <Badge variant="outline" className="font-mono text-xs bg-info/10 text-info border-info/30">
              {algorithm.complexity.space}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tag className="h-3.5 w-3.5" />
          <span>Tags</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {algorithm.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-accent/50 text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Use cases */}
      {algorithm.useCases && algorithm.useCases.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Use Cases:</span>
          <ul className="text-sm text-muted-foreground space-y-1">
            {algorithm.useCases.map((useCase, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                {useCase}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
