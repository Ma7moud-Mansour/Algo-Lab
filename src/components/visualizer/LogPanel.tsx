import { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LogPanelProps {
  logs: string[];
  onClear?: () => void;
  className?: string;
}

export function LogPanel({ logs, onClear, className }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn('glass-panel overflow-hidden flex flex-col', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Console
          </span>
        </div>
        {onClear && logs.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-3 font-mono text-xs space-y-1">
          {logs.length === 0 ? (
            <p className="text-muted-foreground italic">
              Logs will appear here during execution...
            </p>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  'py-0.5 animate-fade-in-up',
                  log.includes('completed') && 'text-success',
                  log.includes('Swap') && 'text-primary',
                  log.includes('Compare') && 'text-secondary',
                  log.includes('Found') && 'text-success font-bold',
                  log.includes('not found') && 'text-destructive',
                  !log.includes('completed') && !log.includes('Swap') && !log.includes('Compare') && !log.includes('Found') && !log.includes('not found') && 'text-muted-foreground'
                )}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
