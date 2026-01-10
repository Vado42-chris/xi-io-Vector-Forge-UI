
import { FileShard, ShardType, VectorLayer } from '../types';

export const SHARD_LIBRARY: Partial<Record<ShardType, any[]>> = {
  vector: [
    {
      id: 'sh-hex-core',
      name: 'HEX_CORE_CHASSIS',
      color: '#b8860b',
      nodes: [
        { id: 'n1', x: 256, y: 150, type: 'move' },
        { id: 'n2', x: 350, y: 200, type: 'line' },
        { id: 'n3', x: 350, y: 312, type: 'line' },
        { id: 'n4', x: 256, y: 362, type: 'line' },
        { id: 'n5', x: 162, y: 312, type: 'line' },
        { id: 'n6', x: 162, y: 200, type: 'line' },
        { id: 'n7', x: 256, y: 150, type: 'close' }
      ]
    },
    {
      id: 'sh-optic-iris',
      name: 'OPTIC_IRIS_V1',
      color: '#00bcd4',
      nodes: [
        { id: 'n1', x: 256, y: 236, type: 'move' },
        { id: 'n2', x: 276, y: 256, type: 'line' },
        { id: 'n3', x: 256, y: 276, type: 'line' },
        { id: 'n4', x: 236, y: 256, type: 'line' },
        { id: 'n5', x: 256, y: 236, type: 'close' }
      ]
    }
  ],
  logic_kernel: [
    { id: 'log-01', name: 'RECURSIVE_YIELD_V8', code: 'ctx.apply(Logic.YIELD_MAX)' }
  ]
};

export const calculateFriction = (layers: VectorLayer[]): number => {
  // Real heuristic calculation: Density per unit area
  const nodeCount = layers.reduce((acc, l) => acc + l.nodes.length, 0);
  if (nodeCount === 0) return 0;
  return Math.min(0.99, (nodeCount * 0.005));
};
