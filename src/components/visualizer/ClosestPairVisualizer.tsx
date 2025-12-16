import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { VisualizationStep } from '@/types/algorithm';

interface Point {
  x: number;
  y: number;
  id: number;
}

interface ClosestPairState {
  points: Point[];
  currentI: number;
  currentJ: number;
  currentDistance: number | null;
  minDistance: number;
  closestPair: [Point, Point] | null;
  checkedPairs: [number, number][];
}

interface ClosestPairVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

export function ClosestPairVisualizer({ currentStep, className }: ClosestPairVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const state = currentStep?.payload as unknown as ClosestPairState | undefined;
  const points = state?.points || [];
  const { width, height } = dimensions;

  // Scaling for points
  const padding = 50;
  const maxX = Math.max(...points.map(p => p.x), 350);
  const maxY = Math.max(...points.map(p => p.y), 300);
  const scaleX = (x: number) => padding + (x / maxX) * (width - 2 * padding);
  const scaleY = (y: number) => padding + (y / maxY) * (height - 2 * padding - 40);

  const isInCheckedPairs = (i: number, j: number) => {
    return state?.checkedPairs.some(([a, b]) => (a === i && b === j) || (a === j && b === i));
  };

  const isClosestPair = (id: number) => {
    return state?.closestPair?.some(p => p.id === id);
  };

  const isCurrentPair = (id: number) => {
    if (!state) return false;
    const idI = points[state.currentI]?.id;
    const idJ = points[state.currentJ]?.id;
    return id === idI || id === idJ;
  };

  return (
    <div ref={containerRef} className={cn('glass-panel p-4 relative overflow-hidden', className)}>
      {/* Header */}
      <div className="absolute top-2 left-4 right-4 flex justify-between items-center z-10">
        <span className="text-xs font-medium text-muted-foreground">Closest Pair of Points</span>
        {state?.minDistance !== undefined && state.minDistance !== Infinity && (
          <span className="text-xs px-2 py-1 rounded bg-success/20 text-success">
            Min: {state.minDistance.toFixed(2)}
          </span>
        )}
      </div>

      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="mt-4">
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Checked pairs (dimmed lines) */}
        {state?.checkedPairs.map(([i, j], idx) => {
          const p1 = points[i];
          const p2 = points[j];
          if (!p1 || !p2) return null;
          const isClosest =
            state.closestPair &&
            ((state.closestPair[0].id === p1.id && state.closestPair[1].id === p2.id) ||
              (state.closestPair[0].id === p2.id && state.closestPair[1].id === p1.id));

          return (
            <line
              key={`checked-${idx}`}
              x1={scaleX(p1.x)}
              y1={scaleY(p1.y)}
              x2={scaleX(p2.x)}
              y2={scaleY(p2.y)}
              stroke={isClosest ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={isClosest ? 3 : 1}
              opacity={isClosest ? 1 : 0.2}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Current comparison line */}
        {state && state.currentI >= 0 && state.currentJ >= 0 && (
          <line
            x1={scaleX(points[state.currentI]?.x || 0)}
            y1={scaleY(points[state.currentI]?.y || 0)}
            x2={scaleX(points[state.currentJ]?.x || 0)}
            y2={scaleY(points[state.currentJ]?.y || 0)}
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            strokeDasharray="8,4"
            className="animate-pulse"
          />
        )}

        {/* Points */}
        {points.map((point) => {
          const isCurrent = isCurrentPair(point.id);
          const isClosest = isClosestPair(point.id);
          const radius = isCurrent ? 12 : isClosest && currentStep?.kind === 'complete' ? 14 : 8;

          return (
            <g key={point.id} className="transition-all duration-300">
              {/* Glow effect */}
              {(isCurrent || (isClosest && currentStep?.kind === 'complete')) && (
                <circle
                  cx={scaleX(point.x)}
                  cy={scaleY(point.y)}
                  r={radius + 6}
                  fill={
                    currentStep?.kind === 'complete' && isClosest
                      ? 'hsl(var(--success))'
                      : isCurrent
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--success))'
                  }
                  opacity={0.3}
                  className="animate-pulse"
                />
              )}

              {/* Point circle */}
              <circle
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r={radius}
                fill={
                  currentStep?.kind === 'complete' && isClosest
                    ? 'hsl(var(--success))'
                    : isCurrent
                    ? 'hsl(var(--primary))'
                    : isClosest
                    ? 'hsl(var(--warning))'
                    : 'hsl(var(--secondary))'
                }
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                className="transition-all duration-300"
              />

              {/* Point label */}
              <text
                x={scaleX(point.x)}
                y={scaleY(point.y) - radius - 6}
                textAnchor="middle"
                className="text-xs font-bold fill-foreground"
              >
                {point.id}
              </text>
            </g>
          );
        })}

        {/* Distance label for current comparison */}
        {state && state.currentDistance !== null && state.currentI >= 0 && state.currentJ >= 0 && (
          <g>
            <rect
              x={(scaleX(points[state.currentI]?.x || 0) + scaleX(points[state.currentJ]?.x || 0)) / 2 - 30}
              y={(scaleY(points[state.currentI]?.y || 0) + scaleY(points[state.currentJ]?.y || 0)) / 2 - 12}
              width={60}
              height={24}
              rx={4}
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
            />
            <text
              x={(scaleX(points[state.currentI]?.x || 0) + scaleX(points[state.currentJ]?.x || 0)) / 2}
              y={(scaleY(points[state.currentI]?.y || 0) + scaleY(points[state.currentJ]?.y || 0)) / 2 + 4}
              textAnchor="middle"
              className="text-xs font-mono fill-primary"
            >
              {state.currentDistance.toFixed(1)}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Closest</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Unchecked</span>
        </div>
      </div>

      {/* Step info */}
      {currentStep?.description && (
        <div className="absolute bottom-2 right-4">
          <div className="bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground max-w-[200px] truncate">
            {currentStep.description}
          </div>
        </div>
      )}
    </div>
  );
}
