/**
 * Marketplace Analytics Dashboard Component
 * Displays sales, views, ratings, and revenue analytics for creators
 * 
 * #hashtag: marketplace analytics-dashboard component
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { marketplaceAnalyticsService, SalesReport, CreatorStats } from '../services/marketplaceAnalyticsService';
import { marketplacePublisherService } from '../services/marketplacePublisherService';

interface MarketplaceAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarketplaceAnalyticsDashboard: React.FC<MarketplaceAnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('monthly');
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen, period]);

  const loadAnalytics = () => {
    setSalesReport(marketplaceAnalyticsService.getSalesReport(period));
    setCreatorStats(marketplaceAnalyticsService.getCreatorStats());
    setTrendingItems(marketplaceAnalyticsService.getTrendingItems(5));
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="analytics-dashboard-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-6xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                analytics
              </span>
              <h2 id="analytics-dashboard-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Marketplace Analytics
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as typeof period)}
                className="xibalba-input min-h-[44px] w-auto"
                aria-label="Select period"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="all-time">All Time</option>
              </select>
              <button
                onClick={onClose}
                className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Close analytics dashboard"
              >
                <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Creator Stats Overview */}
            {creatorStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Total Items</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">{creatorStats.totalItems}</div>
                </div>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Total Views</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">{creatorStats.totalViews.toLocaleString()}</div>
                </div>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Total Sales</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">{creatorStats.totalSales}</div>
                </div>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                  <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Total Revenue</div>
                  <div className="text-2xl font-bold text-[var(--xibalba-accent)]">{creatorStats.totalRevenue.toLocaleString()} credits</div>
                </div>
              </div>
            )}

            {/* Sales Report */}
            {salesReport && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">
                  Sales Report ({period})
                </h3>
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Total Revenue</div>
                      <div className="text-2xl font-bold text-[var(--xibalba-accent)]">
                        {salesReport.totalRevenue.toLocaleString()} credits
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Total Sales</div>
                      <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">
                        {salesReport.totalSales}
                      </div>
                    </div>
                  </div>
                </div>

                {salesReport.items.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[var(--xibalba-text-000)] mb-2">Top Items</h4>
                    {salesReport.items.map((item) => (
                      <div
                        key={item.itemId}
                        className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-[var(--xibalba-text-000)]">{item.title}</div>
                          <div className="text-sm text-[var(--xibalba-text-100)]">
                            {item.sales} sale{item.sales !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[var(--xibalba-accent)]">
                            {item.revenue.toLocaleString()} credits
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--xibalba-text-100)]">
                    <p>No sales in this period</p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Stats */}
            {creatorStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[var(--xibalba-text-000)] mb-3">Performance</h4>
                  <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--xibalba-text-100)]">Average Rating</span>
                      <span className="font-bold text-[var(--xibalba-text-000)]">
                        {creatorStats.averageRating > 0 ? creatorStats.averageRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--xibalba-text-100)]">Total Reviews</span>
                      <span className="font-bold text-[var(--xibalba-text-000)]">{creatorStats.totalReviews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--xibalba-text-100)]">Total Downloads</span>
                      <span className="font-bold text-[var(--xibalba-text-000)]">{creatorStats.totalDownloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[var(--xibalba-text-000)] mb-3">Top Performing Items</h4>
                  <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg space-y-2">
                    {creatorStats.topItems.length > 0 ? (
                      creatorStats.topItems.map((item, index) => (
                        <div key={item.itemId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--xibalba-text-100)] w-6">#{index + 1}</span>
                            <span className="text-sm text-[var(--xibalba-text-000)] truncate">{item.title}</span>
                          </div>
                          <span className="text-sm font-bold text-[var(--xibalba-accent)]">
                            {item.revenue.toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--xibalba-text-100)]">No items yet</p>
                    )}
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

export default MarketplaceAnalyticsDashboard;

