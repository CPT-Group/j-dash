'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  Database, 
  FileText,
  Activity
} from 'lucide-react';

// Import new component architecture
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricGrid from '@/components/data/MetricGrid';
import OverdueAnalytics from '@/components/analytics/OverdueAnalytics';
import DataView from '@/components/DataView';
import CaseCrisisAlert from '@/components/CaseCrisisAlert';
import ToastManager from '@/components/ToastManager';
import { useOverdueTickets, useDueTodayTickets, useMissingComponentTickets, useDataTeamNewTickets, useAllTickets } from '@/hooks/useJiraData';
import { DashboardStats } from '@/types';
import { transformJiraIssuesToTickets } from '@/utils/jira-transform';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    overdueCount: 0,
    dueTodayCount: 0,
    missingComponentsCount: 0,
    dataTeamNewCount: 0,
    totalTickets: 0,
    teamPerformance: { kyle: 0, james: 0, thomas: 0 }
  });

  // Use custom hooks for data fetching
  const { data: overdueData, loading: overdueLoading } = useOverdueTickets();
  const { data: dueTodayData, loading: dueTodayLoading } = useDueTodayTickets();
  const { data: missingComponentData, loading: missingComponentLoading } = useMissingComponentTickets();
  const { data: dataTeamNewData, loading: dataTeamNewLoading } = useDataTeamNewTickets();
  const { data: allTicketsData, loading: allTicketsLoading } = useAllTickets();

  // Update stats when data changes
  useEffect(() => {
    setStats({
      overdueCount: overdueData?.total || 0,
      dueTodayCount: dueTodayData?.total || 0,
      missingComponentsCount: missingComponentData?.total || 0,
      dataTeamNewCount: dataTeamNewData?.total || 0,
      totalTickets: allTicketsData?.total || 0,
      teamPerformance: {
        kyle: allTicketsData?.issues?.filter(t => t.fields.assignee?.displayName === 'Kyle Dilbeck').length || 0,
        james: allTicketsData?.issues?.filter(t => t.fields.assignee?.displayName === 'James Cassidy').length || 0,
        thomas: allTicketsData?.issues?.filter(t => t.fields.assignee?.displayName === 'Thomas Williams').length || 0
      }
    });
  }, [overdueData, dueTodayData, missingComponentData, dataTeamNewData, allTicketsData]);

  // Define metrics for the grid
  const metrics = [
    {
      title: 'Overdue Tickets',
      value: stats.overdueCount.toLocaleString(),
      subtitle: 'Critical backlog',
      icon: <AlertTriangle className="w-6 h-6" />,
      urgent: stats.overdueCount > 1000,
      glow: stats.overdueCount > 5000
    },
    {
      title: 'Due Today',
      value: stats.dueTodayCount.toLocaleString(),
      subtitle: 'Immediate attention',
      icon: <Clock className="w-6 h-6" />,
      urgent: stats.dueTodayCount > 0,
      glow: stats.dueTodayCount > 10
    },
    {
      title: 'Missing Components',
      value: stats.missingComponentsCount.toLocaleString(),
      subtitle: 'Need assignment',
      icon: <Database className="w-6 h-6" />,
      urgent: stats.missingComponentsCount > 1000,
      glow: stats.missingComponentsCount > 5000
    },
    {
      title: 'Data Team New',
      value: stats.dataTeamNewCount.toLocaleString(),
      subtitle: 'Awaiting processing',
      icon: <Activity className="w-6 h-6" />,
      urgent: stats.dataTeamNewCount > 5,
      glow: stats.dataTeamNewCount > 10
    },
    {
      title: 'Total Tickets',
      value: stats.totalTickets.toLocaleString(),
      subtitle: 'CM & OPRD projects',
      icon: <FileText className="w-6 h-6" />,
      urgent: false,
      glow: false
    },
    {
      title: 'Team Workload',
      value: `${stats.teamPerformance.kyle + stats.teamPerformance.james + stats.teamPerformance.thomas}`,
      subtitle: `K:${stats.teamPerformance.kyle} J:${stats.teamPerformance.james} T:${stats.teamPerformance.thomas}`,
      icon: <Users className="w-6 h-6" />,
      urgent: false,
      glow: false
    }
  ];

  const isLoading = overdueLoading || dueTodayLoading || missingComponentLoading || dataTeamNewLoading || allTicketsLoading;

  return (
    <DashboardLayout 
      title="J-Dash Analytics" 
      subtitle="Real-time Jira Analytics for CM & OPRD Projects"
    >
      {/* Crisis Alert */}
      <CaseCrisisAlert 
        caseNumber="CRISIS-001"
        ticketCount={stats.missingComponentsCount}
        tickets={missingComponentData?.issues?.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          assignee: issue.fields.assignee?.displayName || 'Unassigned',
          status: issue.fields.status.name,
          component: issue.fields.components?.[0]?.name || 'No Component'
        })) || []}
      />

      {/* Toast Manager */}
      <ToastManager
        tickets={allTicketsData?.issues ? transformJiraIssuesToTickets(allTicketsData.issues) : []}
        previousTickets={[]}
        overdueCount={stats.overdueCount}
        previousOverdueCount={0}
        missingComponentsCount={stats.missingComponentsCount}
        previousMissingComponentsCount={0}
        dataTeamNewCount={stats.dataTeamNewCount}
        previousDataTeamNewCount={0}
      />

      {/* Loading State */}
      {isLoading && (
        <Card className="animate-pulse">
          <div className="h-32 bg-synth-bg-secondary rounded"></div>
        </Card>
      )}

      {/* Main Metrics Grid */}
      {!isLoading && (
        <MetricGrid 
          metrics={metrics} 
          columns={6}
          className="mb-8"
        />
      )}

      {/* Overdue Analytics Section */}
      {!isLoading && (
        <OverdueAnalytics />
      )}

      {/* Recent Tickets */}
      {!isLoading && allTicketsData && (
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-bold text-synth-text-bright mb-4">
              Recent Tickets ({(allTicketsData?.total || 0).toLocaleString()})
            </h3>
            <DataView
              tickets={allTicketsData?.issues ? transformJiraIssuesToTickets(allTicketsData.issues) : []}
              title=""
              viewType="grid"
              showFilters={true}
            />
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}