import { AlgorithmRunner, VisualizationStep } from '@/types/algorithm';

export interface HanoiInput {
  numDisks: number;
}

export interface HanoiState {
  rods: number[][];
  movingDisk: number | null;
  fromRod: number | null;
  toRod: number | null;
  recursionDepth: number;
  isBaseCase: boolean;
  [key: string]: unknown;
}

const createPayload = (state: Omit<HanoiState, keyof Record<string, unknown>> & Record<string, unknown>): Record<string, unknown> => state;

export const hanoiRunner: AlgorithmRunner<HanoiInput> = {
  getInitialInput: () => ({ numDisks: 4 }),

  validateInput: (input) => {
    if (input.numDisks < 1 || input.numDisks > 8) {
      return { valid: false, error: 'Number of disks must be between 1 and 8' };
    }
    return { valid: true };
  },

  generateSteps: (input) => {
    const steps: VisualizationStep[] = [];
    const { numDisks } = input;

    const rods: number[][] = [
      Array.from({ length: numDisks }, (_, i) => numDisks - i),
      [],
      [],
    ];
    const rodNames = ['A', 'B', 'C'];

    steps.push({
      kind: 'init',
      payload: createPayload({
        rods: rods.map(r => [...r]),
        movingDisk: null,
        fromRod: null,
        toRod: null,
        recursionDepth: 0,
        isBaseCase: false,
      }),
      codeLine: 1,
      description: `Initialize Tower of Hanoi with ${numDisks} disks on rod A`,
    });

    function hanoi(n: number, source: number, auxiliary: number, target: number, depth: number) {
      if (n === 1) {
        steps.push({
          kind: 'base-case',
          payload: createPayload({
            rods: rods.map(r => [...r]),
            movingDisk: rods[source][rods[source].length - 1],
            fromRod: source,
            toRod: target,
            recursionDepth: depth,
            isBaseCase: true,
          }),
          codeLine: 3,
          description: `Base case: Move disk 1 from ${rodNames[source]} to ${rodNames[target]}`,
        });

        const disk = rods[source].pop()!;
        rods[target].push(disk);

        steps.push({
          kind: 'move',
          payload: createPayload({
            rods: rods.map(r => [...r]),
            movingDisk: disk,
            fromRod: source,
            toRod: target,
            recursionDepth: depth,
            isBaseCase: true,
          }),
          codeLine: 4,
          description: `Moved disk ${disk} from ${rodNames[source]} to ${rodNames[target]}`,
        });

        return;
      }

      steps.push({
        kind: 'recursive-call',
        payload: createPayload({
          rods: rods.map(r => [...r]),
          movingDisk: null,
          fromRod: source,
          toRod: auxiliary,
          recursionDepth: depth,
          isBaseCase: false,
          callType: 'first',
          n: n - 1,
        }),
        codeLine: 9,
        description: `Recursive: Move ${n - 1} disks from ${rodNames[source]} to ${rodNames[auxiliary]}`,
      });

      hanoi(n - 1, source, target, auxiliary, depth + 1);

      steps.push({
        kind: 'move-largest',
        payload: createPayload({
          rods: rods.map(r => [...r]),
          movingDisk: rods[source][rods[source].length - 1],
          fromRod: source,
          toRod: target,
          recursionDepth: depth,
          isBaseCase: false,
        }),
        codeLine: 12,
        description: `Move disk ${n} from ${rodNames[source]} to ${rodNames[target]}`,
      });

      const disk = rods[source].pop()!;
      rods[target].push(disk);

      steps.push({
        kind: 'move',
        payload: createPayload({
          rods: rods.map(r => [...r]),
          movingDisk: disk,
          fromRod: source,
          toRod: target,
          recursionDepth: depth,
          isBaseCase: false,
        }),
        codeLine: 12,
        description: `Moved disk ${disk} from ${rodNames[source]} to ${rodNames[target]}`,
      });

      steps.push({
        kind: 'recursive-call',
        payload: createPayload({
          rods: rods.map(r => [...r]),
          movingDisk: null,
          fromRod: auxiliary,
          toRod: target,
          recursionDepth: depth,
          isBaseCase: false,
          callType: 'second',
          n: n - 1,
        }),
        codeLine: 15,
        description: `Recursive: Move ${n - 1} disks from ${rodNames[auxiliary]} to ${rodNames[target]}`,
      });

      hanoi(n - 1, auxiliary, source, target, depth + 1);
    }

    hanoi(numDisks, 0, 1, 2, 0);

    steps.push({
      kind: 'complete',
      payload: createPayload({
        rods: rods.map(r => [...r]),
        movingDisk: null,
        fromRod: null,
        toRod: null,
        recursionDepth: 0,
        isBaseCase: false,
      }),
      codeLine: 16,
      description: `Tower of Hanoi completed! All ${numDisks} disks moved to rod C`,
    });

    return steps;
  },
};
