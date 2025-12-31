/**
 * Performance Dashboard Component
 * Displays performance metrics and cache statistics
 * 
 * #hashtag: performance dashboard component
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { performanceService } from '../services/performanceService';
import ProgressBarFill from './ProgressBarFill';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState(performanceService.getMetrics());
  const [cacheStats, setCacheStats] = useState(performanceService.getCacheStats());

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMetrics(performanceService.getMetrics());
        setCacheStats(performanceService.getCacheStats());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleClearCache = () => {
    if (window.confirm('Clear all cached data? This may slow down subsequent operations.')) {
      performanceService.clearCache();
      setCacheStats(performanceService.getCacheStats());
    }
  };

  const handleClearExpired = () => {
    performanceService.clearExpired();
    setCacheStats(performanceService.getCacheStats());
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="performance-dashboard-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-4xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                speed
              </span>
              <h2 id="performance-dashboard-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Performance Dashboard
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close performance dashboard"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Metrics */}
            <div>
              <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Cache Hits</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-accent)]">{metrics.cacheHits}</div>
                </div>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Cache Misses</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">{metrics.cacheMisses}</div>
                </div>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Avg Response</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">
                    {Math.round(metrics.averageResponseTime)}ms
                  </div>
                </div>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Operations</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">{metrics.operationsCompleted}</div>
                </div>
              </div>
            </div>

            {/* Cache Statistics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)]">Cache Statistics</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearExpired}
                    className="xibalba-button-secondary text-sm px-3 py-1 min-h-[36px]"
                    aria-label="Clear expired cache entries"
                  >
                    Clear Expired
                  </button>
                  <button
                    onClick={handleClearCache}
                    className="xibalba-button-secondary text-sm px-3 py-1 min-h-[36px]"
                    aria-label="Clear all cache"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--xibalba-text-100)]">Cache Size</span>
                  <span className="font-semibold text-[var(--xibalba-text-000)]">
                    {cacheStats.size} / {cacheStats.maxSize}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--xibalba-text-100)]">Hit Rate</span>
                  <span className="font-semibold text-[var(--xibalba-text-000)]">
                    {(cacheStats.hitRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[var(--xibalba-grey-200)] rounded-full h-2">
                  <ProgressBarFill
                    progress={cacheStats.hitRate * 100}
                    className="bg-[var(--xibalba-accent)] h-2 rounded-full transition-all progress-bar-fill performance-progress-bar"
                    ariaLabel={`Cache hit rate: ${(cacheStats.hitRate * 100).toFixed(0)}%`}
                  />
                </div>
              </div>
            </div>

            {/* Cache Entries */}
            {cacheStats.entries.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">Cache Entries</h3>
                <div className="bg-[var(--xibalba-grey-100)] rounded-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--xibalba-grey-200)] sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-[var(--xibalba-text-000)]">Key</th>
                          <th className="text-left p-3 text-[var(--xibalba-text-000)]">Age</th>
                          <th className="text-left p-3 text-[var(--xibalba-text-000)]">Accesses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cacheStats.entries.map((entry) => (
                          <tr key={entry.key} className="">
                            <td className="p-3 text-[var(--xibalba-text-100)] font-mono text-xs truncate max-w-xs">
                              {entry.key}
                            </td>
                            <td className="p-3 text-[var(--xibalba-text-100)]">
                              {Math.round(entry.age / 1000)}s
                            </td>
                            <td className="p-3 text-[var(--xibalba-text-100)]">{entry.accessCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Background Tasks */}
            {metrics.backgroundTasksRunning > 0 && (
              <div>
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">Background Tasks</h3>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[var(--xibalba-accent)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[var(--xibalba-text-000)]">
                      {metrics.backgroundTasksRunning} task{metrics.backgroundTasksRunning !== 1 ? 's' : ''} running
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PerformanceDashboard;

