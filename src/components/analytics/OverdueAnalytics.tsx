'use client';

import { useOverdueTickets } from '../../hooks/useJiraData';
import { Card } from 'primereact/card';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import DataView from '../DataView';
import { transformJiraIssuesToOverdueTickets } from '@/utils/jira-transform';

export default function OverdueAnalytics() {
  const { data, loading, error } = useOverdueTickets();

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-32 bg-synth-bg-secondary rounded"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6 text-center text-synth-error">
          Error loading overdue tickets: {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-synth-text-bright flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-synth-error" />
            Overdue Tickets ({data?.total || 0})
          </h3>
          <div className="flex items-center text-synth-text-muted">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">Critical Priority</span>
          </div>
        </div>
        
        {data && data.issues && data.issues.length > 0 ? (
          <DataView
            tickets={transformJiraIssuesToOverdueTickets(data.issues)}
            title=""
            viewType="list"
            showFilters={false}
          />
        ) : (
          <div className="text-center py-8 text-synth-text-muted">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No overdue tickets found</p>
          </div>
        )}
      </div>
    </Card>
  );
}