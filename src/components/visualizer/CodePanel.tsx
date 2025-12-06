import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AlgorithmCode } from '@/types/algorithm';

interface CodePanelProps {
  code: AlgorithmCode;
  highlightedLine?: number;
  className?: string;
}

// Basic syntax highlighting
function highlightSyntax(line: string, language: string): React.ReactNode {
  if (language === 'pseudocode') {
    // Pseudocode keywords
    const keywords = /\b(if|else|for|while|return|function|to|and|or|not|PARTITION|QUICKSORT|BINARY-SEARCH|BUBBLE-SORT|SELECTION-SORT|length|floor|swap)\b/g;
    const parts = line.split(keywords);
    
    return parts.map((part, i) => {
      if (keywords.test(part)) {
        return <span key={i} className="text-primary font-semibold">{part}</span>;
      }
      // Numbers
      if (/^\d+$/.test(part)) {
        return <span key={i} className="text-secondary">{part}</span>;
      }
      // Comments
      if (part.includes('#') || part.includes('//')) {
        return <span key={i} className="text-muted-foreground italic">{part}</span>;
      }
      return part;
    });
  }

  // JavaScript/Python highlighting
  const result: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // Keywords
  const jsKeywords = /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await|def|in|range|len|True|False|None)\b/;
  // Strings
  const stringPattern = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/;
  // Comments
  const commentPattern = /(\/\/.*|#.*)/;
  // Numbers
  const numberPattern = /\b(\d+)\b/;

  while (remaining.length > 0) {
    // Check for comments first
    const commentMatch = remaining.match(commentPattern);
    if (commentMatch && commentMatch.index === 0) {
      result.push(<span key={key++} className="text-muted-foreground italic">{commentMatch[0]}</span>);
      remaining = remaining.slice(commentMatch[0].length);
      continue;
    }

    // Check for strings
    const stringMatch = remaining.match(stringPattern);
    if (stringMatch && stringMatch.index === 0) {
      result.push(<span key={key++} className="text-success">{stringMatch[0]}</span>);
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Check for keywords
    const keywordMatch = remaining.match(jsKeywords);
    if (keywordMatch && remaining.indexOf(keywordMatch[0]) === 0) {
      result.push(<span key={key++} className="text-primary font-semibold">{keywordMatch[0]}</span>);
      remaining = remaining.slice(keywordMatch[0].length);
      continue;
    }

    // Check for numbers
    const numberMatch = remaining.match(numberPattern);
    if (numberMatch && remaining.indexOf(numberMatch[0]) === 0) {
      result.push(<span key={key++} className="text-secondary">{numberMatch[0]}</span>);
      remaining = remaining.slice(numberMatch[0].length);
      continue;
    }

    // Default: take one character
    result.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return result;
}

export function CodePanel({ code, highlightedLine, className }: CodePanelProps) {
  const highlightedCode = useMemo(() => {
    return code.lines.map((line, index) => ({
      line,
      highlighted: highlightSyntax(line, code.language),
      lineNumber: index,
    }));
  }, [code]);

  return (
    <div className={cn('glass-panel overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {code.language}
        </span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-secondary/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-2.5rem)] scrollbar-thin">
        <div className="p-4 font-mono text-sm">
          {highlightedCode.map(({ line, highlighted, lineNumber }) => (
            <div
              key={lineNumber}
              className={cn(
                'flex transition-all duration-300 rounded',
                highlightedLine === lineNumber && 'bg-secondary/20 glow-secondary'
              )}
            >
              <span className="w-8 flex-shrink-0 text-right pr-4 text-muted-foreground/50 select-none">
                {lineNumber + 1}
              </span>
              <pre className="flex-1 whitespace-pre-wrap">
                <code>{highlighted || ' '}</code>
              </pre>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
