/**
 * Error Dashboard Component
 * Displays error logs, patterns, and insights
 * Part of Patch 5: Error Logging & Intelligence
 */

import React, { useState, useEffect } from 'react';
import { errorLogger, ErrorLog } from '../services/errorLogger';
import { errorIntelligence, ErrorInsight } from '../services/errorIntelligence';

interface ErrorDashboardProps {
  onClose?: () => void;
}

const ErrorDashboard: React.FC<ErrorDashboardProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [insights, setInsights] = useState<ErrorInsight[]>([]);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info' | 'security'>('all');
  const [stats, setStats] = useState(errorLogger.getStatistics());

  useEffect(() => {
    loadLogs();
    analyzeErrors();
    const interval = setInterval(() => {
      loadLogs();
      analyzeErrors();
      setStats(errorLogger.getStatistics());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = () => {
    const allLogs = errorLogger.getLogs();
    const filtered = filter === 'all' 
      ? allLogs 
      : allLogs.filter(log => log.type === filter);
    setLogs(filtered);
  };

  const analyzeErrors = () => {
    const newInsights = errorIntelligence.analyzeErrors();
    setInsights(newInsights);
  };

  const handleExport = () => {
    const exported = errorLogger.exportLogs('json');
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Clear all error logs?')) {
      errorLogger.clearLogs();
      loadLogs();
      analyzeErrors();
      setStats(errorLogger.getStatistics());
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-[var(--vectorforge-accent)]';
      case 'high': return 'text-[var(--vectorforge-accent)]';
      case 'medium': return 'text-[var(--vectorforge-accent)]';
      case 'low': return 'text-[var(--xibalba-text-100)]';
      default: return 'text-[var(--xibalba-text-100)]';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-[var(--vectorforge-accent)]/20 text-[var(--vectorforge-accent)]';
      case 'warning': return 'bg-[var(--vectorforge-accent)]/20 text-[var(--vectorforge-accent)]';
      case 'security': return 'bg-[var(--xibalba-grey-200)]/20 text-[var(--xibalba-text-100)]';
      case 'info': return 'bg-[var(--xibalba-accent)]/20 text-[var(--xibalba-accent)]';
      default: return 'bg-[var(--xibalba-grey-200)]/20 text-[var(--xibalba-text-100)]';
    }
  };

  return (
    <div className="fixed inset-0 zstack-modal-backdrop bg-[var(--xibalba-grey-000)]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-[var(--xibalba-bg-secondary)] rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--xibalba-text-primary)]">Error Dashboard</h2>
            <p className="text-sm text-[var(--xibalba-text-100)]">
              Session: {errorLogger.getSessionId()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 bg-[var(--xibalba-bg-tertiary)] hover:bg-[var(--xibalba-bg-hover)] text-[var(--xibalba-text-primary)] text-sm rounded transition-colors"
            >
              Export
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-[var(--vectorforge-accent)]/20 hover:bg-[var(--vectorforge-accent)]/30 text-[var(--vectorforge-accent)] text-sm rounded transition-colors"
            >
              Clear
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-[var(--xibalba-bg-tertiary)] hover:bg-[var(--xibalba-bg-hover)] text-[var(--xibalba-text-primary)] text-sm rounded transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[var(--xibalba-bg-tertiary)] p-3 rounded">
              <div className="text-sm text-[var(--xibalba-text-100)]">Total Errors</div>
              <div className="text-2xl font-bold text-[var(--xibalba-text-primary)]">{stats.total}</div>
            </div>
            <div className="bg-[var(--xibalba-bg-tertiary)] p-3 rounded">
              <div className="text-sm text-[var(--xibalba-text-100)]">Recent (1h)</div>
              <div className="text-2xl font-bold text-[var(--xibalba-text-primary)]">{stats.recent}</div>
            </div>
            <div className="bg-[var(--xibalba-bg-tertiary)] p-3 rounded">
              <div className="text-sm text-[var(--xibalba-text-100)]">Errors</div>
              <div className="text-2xl font-bold text-[var(--vectorforge-accent)]">{stats.byType.error || 0}</div>
            </div>
            <div className="bg-[var(--xibalba-bg-tertiary)] p-3 rounded">
              <div className="text-sm text-[var(--xibalba-text-100)]">Warnings</div>
              <div className="text-2xl font-bold text-[var(--vectorforge-accent)]">{stats.byType.warning || 0}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Insights Panel */}
          <div className="w-1/3 p-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-[var(--xibalba-text-primary)] mb-4">Insights</h3>
            <div className="space-y-3">
              {insights.length === 0 ? (
                <div className="text-sm text-[var(--xibalba-text-100)]">No insights available</div>
              ) : (
                insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--xibalba-bg-tertiary)] p-3 rounded"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold uppercase ${getSeverityColor(insight.severity)}`}>
                        {insight.severity}
                      </span>
                      <span className="text-xs text-[var(--xibalba-text-100)]">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                    <h4 className="font-semibold text-[var(--xibalba-text-primary)] mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-[var(--xibalba-text-100)] mb-2">
                      {insight.description}
                    </p>
                    {insight.suggestedActions.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-[var(--xibalba-text-100)] mb-1">Suggested Actions:</div>
                        <ul className="list-disc list-inside text-xs text-[var(--xibalba-text-100)] space-y-1">
                          {insight.suggestedActions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Logs Panel */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--xibalba-text-primary)]">Error Logs</h3>
              <div className="flex gap-2">
                {(['all', 'error', 'warning', 'info', 'security'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilter(type);
                      loadLogs();
                    }}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      filter === type
                        ? 'bg-[var(--xibalba-accent)] text-white'
                        : 'bg-[var(--xibalba-bg-tertiary)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-bg-hover)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-sm text-[var(--xibalba-text-100)]">No logs found</div>
              ) : (
                logs.map(log => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`bg-[var(--xibalba-bg-tertiary)] p-3 rounded cursor-pointer hover:bg-[var(--xibalba-bg-hover)] transition-colors ${
                      selectedLog?.id === log.id ? 'border-[var(--xibalba-accent)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                      <span className="text-xs text-[var(--xibalba-text-100)]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--xibalba-text-primary)] font-medium mb-1">
                      {log.message}
                    </div>
                    {log.context && Object.keys(log.context).length > 0 && (
                      <div className="text-xs text-[var(--xibalba-text-100)]">
                        Context: {JSON.stringify(log.context).substring(0, 100)}...
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Log Details */}
        {selectedLog && (
          <div className="p-4 max-h-48 overflow-y-auto">
            <h4 className="font-bold text-[var(--xibalba-text-primary)] mb-2">Log Details</h4>
            <pre className="text-xs text-[var(--xibalba-text-100)] bg-[var(--xibalba-bg-tertiary)] p-3 rounded overflow-x-auto">
              {JSON.stringify(selectedLog, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorDashboard;

