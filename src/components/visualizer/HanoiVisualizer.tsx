import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { VisualizationStep } from '@/types/algorithm';

interface HanoiVisualizerProps {
  currentStep: VisualizationStep | null;
  className?: string;
}

interface HanoiState {
  rods: number[][];
  movingDisk: number | null;
  fromRod: number | null;
  toRod: number | null;
  recursionDepth: number;
  isBaseCase: boolean;
}

const ROD_NAMES = ['A', 'B', 'C'];
const DISK_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(340, 82%, 52%)',
  'hsl(280, 68%, 60%)',
  'hsl(200, 98%, 48%)',
];

export function HanoiVisualizer({ currentStep, className }: HanoiVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        // Maintain a pleasant aspect ratio while letting height be content-driven
        const height = Math.max(260, clientWidth * 0.5);
        setDimensions({
          width: clientWidth,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const state = currentStep?.payload as unknown as HanoiState | undefined;
  const rods = state?.rods || [[], [], []];
  const maxDisks = Math.max(
    ...rods.map(r => r.length),
    rods.flat().length > 0 ? Math.max(...rods.flat()) : 4
  );

  const { width, height } = dimensions;
  const rodSpacing = width / 4;
  const rodWidth = 8;
  const baseHeight = 20;
  const rodHeight = height * 0.6;
  const diskHeight = Math.min(30, (rodHeight - 40) / maxDisks);
  const maxDiskWidth = rodSpacing * 0.8;
  const minDiskWidth = 30;

  const getDiskWidth = (disk: number) => {
    const widthRange = maxDiskWidth - minDiskWidth;
    return minDiskWidth + (disk / maxDisks) * widthRange;
  };

  const getDiskColor = (disk: number) => {
    return DISK_COLORS[(disk - 1) % DISK_COLORS.length];
  };

  return (
    <div ref={containerRef} className={cn('glass-panel p-4', className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-muted-foreground">Tower of Hanoi</span>
        {state?.recursionDepth !== undefined && (
          <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
            Depth: {state.recursionDepth}
          </span>
        )}
      </div>

      {/* Visualization */}
      <div className="w-full overflow-x-hidden">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mt-2 block"
        >
        {/* Base platform */}
        <rect
          x={20}
          y={height - baseHeight - 10}
          width={width - 40}
          height={baseHeight}
          rx={4}
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />

        {/* Rods */}
        {[0, 1, 2].map((rodIndex) => {
          const rodX = rodSpacing * (rodIndex + 1);
          const rodY = height - baseHeight - 10 - rodHeight;
          const isSource = state?.fromRod === rodIndex;
          const isTarget = state?.toRod === rodIndex;

          return (
            <g key={rodIndex}>
              {/* Rod pole */}
              <rect
                x={rodX - rodWidth / 2}
                y={rodY}
                width={rodWidth}
                height={rodHeight}
                rx={rodWidth / 2}
                fill={
                  isTarget
                    ? 'hsl(var(--success))'
                    : isSource
                    ? 'hsl(var(--warning))'
                    : 'hsl(var(--muted-foreground))'
                }
                className="transition-all duration-300"
              />

              {/* Rod label */}
              <text
                x={rodX}
                y={height - 5}
                textAnchor="middle"
                className="fill-foreground text-sm font-bold"
              >
                {ROD_NAMES[rodIndex]}
              </text>

              {/* Disks on this rod */}
              {rods[rodIndex]?.map((disk, diskIndex) => {
                const diskWidth = getDiskWidth(disk);
                const diskX = rodX - diskWidth / 2;
                const diskY = height - baseHeight - 10 - (diskIndex + 1) * diskHeight;
                const isMoving = state?.movingDisk === disk;

                return (
                  <g key={`${rodIndex}-${disk}`}>
                    <rect
                      x={diskX}
                      y={diskY}
                      width={diskWidth}
                      height={diskHeight - 4}
                      rx={6}
                      fill={getDiskColor(disk)}
                      stroke={isMoving ? 'hsl(var(--foreground))' : 'none'}
                      strokeWidth={isMoving ? 3 : 0}
                      className="transition-all duration-500 ease-out"
                      style={{
                        filter: isMoving ? 'drop-shadow(0 0 12px hsl(var(--primary)))' : 'none',
                      }}
                    />
                    <text
                      x={rodX}
                      y={diskY + (diskHeight - 4) / 2 + 4}
                      textAnchor="middle"
                      className="fill-foreground text-xs font-bold pointer-events-none"
                    >
                      {disk}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

          {/* Recursion indicator */}
        {state?.isBaseCase !== undefined && (
          <g>
            <rect
              x={width - 110}
              y={10}
              width={100}
              height={28}
              rx={4}
              fill={state.isBaseCase ? 'hsl(var(--success) / 0.2)' : 'hsl(var(--info) / 0.2)'}
            />
            <text
              x={width - 60}
              y={28}
              textAnchor="middle"
              className="text-xs font-medium"
              fill={state.isBaseCase ? 'hsl(var(--success))' : 'hsl(var(--info))'}
            >
              {state.isBaseCase ? 'Base Case' : 'Recursive'}
            </text>
          </g>
          )}
        </svg>
      </div>

      {/* Step description */}
      {currentStep?.description && (
        <div className="mt-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
            <p className="text-xs text-center text-muted-foreground">
              {currentStep.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
