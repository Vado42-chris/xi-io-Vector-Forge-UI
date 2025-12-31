
import React, { useRef } from 'react';

interface TimelineProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onScrub: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ isPlaying, currentTime, duration, onPlayPause, onScrub }) => {
  return (
    <div className="h-24 bg-[var(--xibalba-grey-050)] border-t border-white/5 flex items-center px-6 gap-6">
      <button
        onClick={onPlayPause}
        className="size-10 flex items-center justify-center rounded-none bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-000)]"
      >
        <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
      </button>
      <div className="flex-1 flex items-center gap-4">
        <span className="text-xs font-mono text-[var(--xibalba-text-100)] w-16">{currentTime.toFixed(2)}s</span>
        <div className="flex-1 h-1.5 bg-[var(--xibalba-grey-200)] rounded-none relative">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={(e) => onScrub(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            ref={(node) => {
              if (node) {
                node.style.setProperty('--progress-width', `${(currentTime / duration) * 100}%`);
              }
            }}
            className="absolute top-0 left-0 h-full bg-[var(--xibalba-text-200)] rounded-none progress-bar-fill"
          />
        </div>
        <span className="text-xs font-mono text-[var(--xibalba-text-100)]">{duration.toFixed(2)}s</span>
      </div>
    </div>
  );
};

export default Timeline;
