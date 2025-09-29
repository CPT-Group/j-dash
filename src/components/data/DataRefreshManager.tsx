'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';
import { clearJiraCache, getCacheStats } from '@/hooks/useJiraDataEnhanced';

interface DataRefreshManagerProps {
  onRefresh?: () => void;
  lastUpdated?: Date;
  className?: string;
}

export default function DataRefreshManager({ 
  onRefresh, 
  lastUpdated = new Date(),
  className = ""
}: DataRefreshManagerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheStats, setCacheStats] = useState(getCacheStats());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute default

  // Update cache stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(getCacheStats());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, refreshInterval]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Clear cache to force fresh data
      clearJiraCache();
      
      // Trigger refresh in parent component
      if (onRefresh) {
        await onRefresh();
      }
      
      // Update cache stats
      setCacheStats(getCacheStats());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const handleClearCache = useCallback(() => {
    clearJiraCache();
    setCacheStats(getCacheStats());
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getCacheHealthColor = () => {
    const validRatio = cacheStats.validEntries / Math.max(cacheStats.totalEntries, 1);
    if (validRatio > 0.8) return 'success';
    if (validRatio > 0.5) return 'warning';
    return 'danger';
  };

  return (
    <Card className={`bg-synth-bg-card border border-synth-border-primary ${className}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-lg font-semibold text-synth-text-bright">
              Data Management
            </h3>
            <Badge 
              value={cacheStats.totalEntries}
              severity="info"
            />
            <Badge 
              value={`${cacheStats.validEntries} valid`} 
              severity={getCacheHealthColor() as 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'}
            />
          </div>
          
          <div className="text-sm text-synth-text-muted">
            Last updated: {formatTimeAgo(lastUpdated)}
          </div>
          
          <div className="mt-2">
            <div className="flex items-center gap-2 text-xs text-synth-text-muted">
              <span>Cache Health:</span>
              <ProgressBar 
                value={(cacheStats.validEntries / Math.max(cacheStats.totalEntries, 1)) * 100}
                className="w-20 h-1"
                pt={{
                  root: { className: 'bg-synth-bg-hover' },
                  value: { className: `bg-${getCacheHealthColor() === 'success' ? 'green' : getCacheHealthColor() === 'warning' ? 'yellow' : 'red'}-500` }
                }}
              />
              <span className="text-xs">
                {Math.round((cacheStats.validEntries / Math.max(cacheStats.totalEntries, 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-refresh"
            label="Refresh"
            size="small"
            loading={isRefreshing}
            onClick={handleRefresh}
            className="p-button-outlined"
            tooltip="Force refresh all data"
          />
          
          <Button
            icon="pi pi-trash"
            label="Clear Cache"
            size="small"
            severity="secondary"
            outlined
            onClick={handleClearCache}
            tooltip="Clear all cached data"
          />
          
          <Button
            icon={autoRefreshEnabled ? "pi pi-pause" : "pi pi-play"}
            label={autoRefreshEnabled ? "Pause Auto" : "Resume Auto"}
            size="small"
            severity={autoRefreshEnabled ? "warning" : "success"}
            outlined
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            tooltip={autoRefreshEnabled ? "Pause automatic refresh" : "Resume automatic refresh"}
          />
        </div>
      </div>

      {/* Cache Details */}
      <div className="mt-4 pt-4 border-t border-synth-border-primary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-synth-text-muted">Total Entries</div>
            <div className="font-semibold text-synth-text-bright">{cacheStats.totalEntries}</div>
          </div>
          <div>
            <div className="text-synth-text-muted">Valid Entries</div>
            <div className="font-semibold text-green-500">{cacheStats.validEntries}</div>
          </div>
          <div>
            <div className="text-synth-text-muted">Expired Entries</div>
            <div className="font-semibold text-red-500">{cacheStats.expiredEntries}</div>
          </div>
          <div>
            <div className="text-synth-text-muted">Auto Refresh</div>
            <div className="font-semibold text-synth-text-bright">
              {autoRefreshEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip target=".p-button" position="top" />
    </Card>
  );
}
