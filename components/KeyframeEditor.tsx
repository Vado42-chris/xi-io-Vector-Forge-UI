
import React from 'react';
import { Keyframe, VectorLayer } from '../types';

interface KeyframeEditorProps {
  selectedLayer: VectorLayer;
  onAddKeyframe: (property: string, time: number, value: any) => void;
  onDeleteKeyframe: (property: string, time: number) => void;
}

const KeyframeEditor: React.FC<KeyframeEditorProps> = ({ selectedLayer, onAddKeyframe, onDeleteKeyframe }) => {
  const properties = ['color', 'opacity', 'width', 'height', 'borderRadius', 'rx', 'ry'];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-bold">Keyframes</h3>
      {properties.map(prop => (
        <div key={prop}>
          <div className="flex justify-between items-center">
            <span className="text-xs">{prop}</span>
            <button
              onClick={() => onAddKeyframe(prop, 0, (selectedLayer as any)[prop] ?? (selectedLayer.shape as any)[prop])}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
            >
              +
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {selectedLayer.keyframes
              .filter(k => k.property === prop)
              .map(k => (
                <div key={k.time} className="flex justify-between items-center text-xs">
                  <span>Time: {k.time.toFixed(2)}s</span>
                  <span>Value: {k.value}</span>
                  <button
                    onClick={() => onDeleteKeyframe(prop, k.time)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    -
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyframeEditor;
