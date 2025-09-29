'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Clock, Users } from 'lucide-react';

interface DashboardStats {
  overdueCount: number;
  dueTodayCount: number;
  missingComponentsCount: number;
  activeTeamMembers: number;
}

interface DashboardHeaderProps {
  stats: DashboardStats;
  lastUpdated: Date;
}

export default function DashboardHeader({ stats, lastUpdated }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:-- --';
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-synth-bg-primary border-b border-synth-border-primary">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-synth-neon-purple text-synth-bg-primary p-3 rounded-lg shadow-neon">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-synth-text-bright bg-gradient-to-r from-synth-neon-purple to-synth-neon-cyan bg-clip-text text-transparent">
                J-Dash
              </h1>
              <p className="text-synth-text-muted text-sm">
                Real-time Jira Analytics for CPT Group
              </p>
            </div>
          </div>

          {/* Live Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-synth-text-muted text-sm">Live Time</div>
              <div className="text-synth-text-bright text-lg font-mono">
                {formatTime(currentTime)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-synth-text-muted text-sm">Last Updated</div>
              <div className="text-synth-text-secondary text-sm">
                {formatTime(lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Ticker */}
      <div className="bg-synth-bg-secondary border-t border-synth-border-secondary">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center space-x-8 overflow-hidden">
            <div className="flex items-center space-x-2 text-synth-status-error animate-neon-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">CRITICAL ALERTS</span>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="animate-ticker whitespace-nowrap text-synth-text-primary">
                <span className="text-synth-status-error font-bold">
                  {stats.overdueCount} OVERDUE TICKETS
                </span>
                <span className="mx-8 text-synth-text-muted">•</span>
                <span className="text-synth-status-warning font-bold">
                  {stats.dueTodayCount} DUE TODAY
                </span>
                <span className="mx-8 text-synth-text-muted">•</span>
                <span className="text-synth-neon-yellow font-bold">
                  {stats.missingComponentsCount} MISSING COMPONENTS
                </span>
                <span className="mx-8 text-synth-text-muted">•</span>
                <span className="text-synth-status-info font-bold">
                  {stats.activeTeamMembers} ACTIVE TEAM MEMBERS
                </span>
                <span className="mx-8 text-synth-text-muted">•</span>
                <span className="text-synth-neon-green font-bold">
                  DATA TEAM: KYLE • JAMES • THOMAS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
