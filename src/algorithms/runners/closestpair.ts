import { AlgorithmRunner, VisualizationStep } from '@/types/algorithm';

export interface Point {
  x: number;
  y: number;
  id: number;
}

export interface ClosestPairInput {
  points: Point[];
}

export interface ClosestPairState {
  points: Point[];
  currentI: number;
  currentJ: number;
  currentDistance: number | null;
  minDistance: number;
  closestPair: [Point, Point] | null;
  checkedPairs: [number, number][];
  [key: string]: unknown;
}

function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const createPayload = (state: Omit<ClosestPairState, keyof Record<string, unknown>> & Record<string, unknown>): Record<string, unknown> => state;

export const closestPairRunner: AlgorithmRunner<ClosestPairInput> = {
  getInitialInput: () => ({
    points: [
      { x: 50, y: 80, id: 0 },
      { x: 150, y: 120, id: 1 },
      { x: 200, y: 50, id: 2 },
      { x: 100, y: 200, id: 3 },
      { x: 250, y: 180, id: 4 },
      { x: 300, y: 100, id: 5 },
      { x: 80, y: 280, id: 6 },
      { x: 180, y: 250, id: 7 },
    ],
  }),

  validateInput: (input) => {
    if (input.points.length < 2) {
      return { valid: false, error: 'At least 2 points are required' };
    }
    if (input.points.length > 20) {
      return { valid: false, error: 'Maximum 20 points allowed' };
    }
    return { valid: true };
  },

  generateSteps: (input) => {
    const steps: VisualizationStep[] = [];
    const { points } = input;
    const checkedPairs: [number, number][] = [];
    let minDistance = Infinity;
    let closestPair: [Point, Point] | null = null;

    steps.push({
      kind: 'init',
      payload: createPayload({
        points,
        currentI: -1,
        currentJ: -1,
        currentDistance: null,
        minDistance: Infinity,
        closestPair: null,
        checkedPairs: [],
      }),
      codeLine: 1,
      description: `Initialize with ${points.length} points. Finding closest pair...`,
    });

    steps.push({
      kind: 'start-loop',
      payload: createPayload({
        points,
        currentI: 0,
        currentJ: -1,
        currentDistance: null,
        minDistance: Infinity,
        closestPair: null,
        checkedPairs: [],
      }),
      codeLine: 6,
      description: 'Start comparing all pairs of points',
    });

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        steps.push({
          kind: 'compare',
          payload: createPayload({
            points,
            currentI: i,
            currentJ: j,
            currentDistance: null,
            minDistance,
            closestPair,
            checkedPairs: [...checkedPairs],
          }),
          codeLine: 7,
          description: `Comparing point ${i} and point ${j}`,
        });

        const dist = distance(points[i], points[j]);

        steps.push({
          kind: 'calculate-distance',
          payload: createPayload({
            points,
            currentI: i,
            currentJ: j,
            currentDistance: dist,
            minDistance,
            closestPair,
            checkedPairs: [...checkedPairs],
          }),
          codeLine: 9,
          description: `Distance between point ${i} and point ${j}: ${dist.toFixed(2)}`,
        });

        if (dist < minDistance) {
          minDistance = dist;
          closestPair = [points[i], points[j]];

          steps.push({
            kind: 'new-minimum',
            payload: createPayload({
              points,
              currentI: i,
              currentJ: j,
              currentDistance: dist,
              minDistance,
              closestPair,
              checkedPairs: [...checkedPairs],
            }),
            codeLine: 12,
            description: `New closest pair found! Distance: ${dist.toFixed(2)}`,
          });
        }

        checkedPairs.push([i, j]);

        steps.push({
          kind: 'pair-checked',
          payload: createPayload({
            points,
            currentI: i,
            currentJ: j,
            currentDistance: dist,
            minDistance,
            closestPair,
            checkedPairs: [...checkedPairs],
          }),
          codeLine: 15,
          description: `Pair (${i}, ${j}) checked. Min distance: ${minDistance.toFixed(2)}`,
        });
      }
    }

    steps.push({
      kind: 'complete',
      payload: createPayload({
        points,
        currentI: -1,
        currentJ: -1,
        currentDistance: null,
        minDistance,
        closestPair,
        checkedPairs,
      }),
      codeLine: 19,
      description: `Complete! Closest pair: points ${closestPair?.[0].id} and ${closestPair?.[1].id} with distance ${minDistance.toFixed(2)}`,
    });

    return steps;
  },
};
