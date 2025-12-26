
import React from 'react';

interface TimelineProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onScrub: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ isPlaying, currentTime, duration, onPlayPause, onScrub }) => {
  return (
    <div className="h-24 bg-obsidian-100 border-t border-white/5 flex items-center px-6 gap-6">
      <button
        onClick={onPlayPause}
        className="size-10 flex items-center justify-center rounded-full bg-primary text-black"
      >
        <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
      </button>
      <div className="flex-1 flex items-center gap-4">
        <span className="text-xs font-mono text-obsidian-500 w-16">{currentTime.toFixed(2)}s</span>
        <div className="flex-1 h-1.5 bg-obsidian-300 rounded-full relative">
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
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono text-obsidian-500">{duration.toFixed(2)}s</span>
      </div>
    </div>
  );
};

export default Timeline;
