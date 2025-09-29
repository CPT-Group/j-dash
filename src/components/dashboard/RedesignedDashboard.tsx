'use client';

import { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';
import { Divider } from 'primereact/divider';

// Import new PrimeReact components
import WorkflowChart from '@/components/analytics/WorkflowChart';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import StatusKanban from '@/components/kanban/StatusKanban';
import TeamOrgChart from '@/components/team/TeamOrgChart';
import AdvancedDataTable from '@/components/data/AdvancedDataTable';

// Import existing components
import CaseCrisisAlert from '@/components/CaseCrisisAlert';
import ToastManager from '@/components/ToastManager';
import TicketDetailsDialog from '@/components/dialogs/TicketDetailsDialog';
import CrisisManagementDialog from '@/components/dialogs/CrisisManagementDialog';

// Import hooks and types
import { useOverdueTickets, useDueTodayTickets, useMissingComponentTickets, useDataTeamNewTickets, useAllTickets } from '@/hooks/useJiraData';
import { transformJiraIssuesToTickets } from '@/utils/jira-transform';
import { Ticket } from '@/types/components/tickets';

interface DashboardStats {
  overdueCount: number;
  dueTodayCount: number;
  missingComponentsCount: number;
  dataTeamNewCount: number;
  totalTickets: number;
  teamPerformance: {
    kyle: number;
    james: number;
    thomas: number;
  };
}

export default function RedesignedDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    overdueCount: 0,
    dueTodayCount: 0,
    missingComponentsCount: 0,
    dataTeamNewCount: 0,
    totalTickets: 0,
    teamPerformance: { kyle: 0, james: 0, thomas: 0 }
  });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [showCrisisDialog, setShowCrisisDialog] = useState(false);

  // Use custom hooks for data fetching
  const { data: overdueData, loading: overdueLoading } = useOverdueTickets();
  const { data: dueTodayData, loading: dueTodayLoading } = useDueTodayTickets();
  const { data: missingComponentData, loading: missingComponentLoading } = useMissingComponentTickets();
  const { data: dataTeamNewData, loading: dataTeamNewLoading } = useDataTeamNewTickets();
  const { data: allTicketsData, loading: allTicketsLoading } = useAllTickets();

  // Transform all tickets data
  const allTickets = allTicketsData?.issues ? transformJiraIssuesToTickets(allTicketsData.issues) : [];

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

  const isLoading = overdueLoading || dueTodayLoading || missingComponentLoading || dataTeamNewLoading || allTicketsLoading;

  // Calculate completion rate
  const completedTickets = allTickets.filter(t => ['Completed', 'Resolved', 'Done'].includes(t.status)).length;
  const completionRate = allTickets.length > 0 ? Math.round((completedTickets / allTickets.length) * 100) : 0;

  // Calculate overdue rate
  const overdueRate = allTickets.length > 0 ? Math.round((stats.overdueCount / allTickets.length) * 100) : 0;

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDialog(true);
  };

  // Calculate workload imbalance for crisis dialog
  const workloadImbalance = allTickets.reduce((acc, ticket) => {
    acc[ticket.assignee] = (acc[ticket.assignee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const workloadArray = Object.entries(workloadImbalance)
    .map(([assignee, count]) => ({ assignee, count }))
    .sort((a, b) => b.count - a.count);

  const crisisData = {
    overdueTickets: overdueData?.issues ? transformJiraIssuesToTickets(overdueData.issues) : [],
    missingComponentTickets: missingComponentData?.issues ? transformJiraIssuesToTickets(missingComponentData.issues) : [],
    dataTeamNewTickets: dataTeamNewData?.issues ? transformJiraIssuesToTickets(dataTeamNewData.issues) : [],
    workloadImbalance: workloadArray
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-synth-text-bright mb-2">
                J-Dash Analytics
              </h1>
              <p className="text-synth-text-muted text-lg">
                Real-time Jira Analytics for CM & OPRD Projects
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                icon="pi pi-exclamation-triangle"
                label="Crisis Management"
                className="p-button-warning p-button-outlined"
                onClick={() => setShowCrisisDialog(true)}
                disabled={stats.overdueCount === 0 && stats.missingComponentsCount === 0 && stats.dataTeamNewCount === 0}
              />
              <div className="text-right">
                <div className="text-sm text-synth-text-muted mb-1">Last Updated</div>
                <div className="text-synth-text-bright font-semibold">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-synth-bg-card border border-synth-border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-synth-text-bright">
                    {stats.totalTickets.toLocaleString()}
                  </div>
                  <div className="text-synth-text-muted text-sm">Total Tickets</div>
                </div>
                <div className="text-3xl text-blue-500">
                  <i className="pi pi-ticket"></i>
                </div>
              </div>
            </Card>

            <Card className="bg-synth-bg-card border border-synth-border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {stats.overdueCount}
                  </div>
                  <div className="text-synth-text-muted text-sm">Overdue Tickets</div>
                  <div className="text-xs text-synth-text-muted mt-1">
                    {overdueRate}% of total
                  </div>
                </div>
                <div className="text-3xl text-red-500">
                  <i className="pi pi-exclamation-triangle"></i>
                </div>
              </div>
            </Card>

            <Card className="bg-synth-bg-card border border-synth-border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-500">
                    {stats.missingComponentsCount}
                  </div>
                  <div className="text-synth-text-muted text-sm">Missing Components</div>
                </div>
                <div className="text-3xl text-orange-500">
                  <i className="pi pi-wrench"></i>
                </div>
              </div>
            </Card>

            <Card className="bg-synth-bg-card border border-synth-border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {completionRate}%
                  </div>
                  <div className="text-synth-text-muted text-sm">Completion Rate</div>
                </div>
                <div className="text-3xl text-green-500">
                  <i className="pi pi-check-circle"></i>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-synth-bg-card border border-synth-border-primary">
              <h3 className="text-lg font-semibold text-synth-text-bright mb-3">
                Project Health
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-synth-text-muted">Completion Rate</span>
                    <span className="text-synth-text-bright font-semibold">{completionRate}%</span>
                  </div>
                  <ProgressBar 
                    value={completionRate} 
                    className="h-2"
                    pt={{
                      root: { className: 'bg-synth-bg-hover' },
                      value: { className: 'bg-green-500' }
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-synth-text-muted">Overdue Rate</span>
                    <span className="text-synth-text-bright font-semibold">{overdueRate}%</span>
                  </div>
                  <ProgressBar 
                    value={overdueRate} 
                    className="h-2"
                    pt={{
                      root: { className: 'bg-synth-bg-hover' },
                      value: { className: 'bg-red-500' }
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-synth-bg-card border border-synth-border-primary">
              <h3 className="text-lg font-semibold text-synth-text-bright mb-3">
                Team Workload
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-synth-text-muted">Kyle Dilbeck</span>
                  <Badge value={stats.teamPerformance.kyle} severity="info" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-synth-text-muted">James Cassidy</span>
                  <Badge value={stats.teamPerformance.james} severity="info" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-synth-text-muted">Thomas Williams</span>
                  <Badge value={stats.teamPerformance.thomas} severity="info" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Crisis Alerts */}
        {stats.overdueCount > 10 && (
          <CaseCrisisAlert 
            caseNumber={`OVERDUE-CRISIS-${stats.overdueCount}`}
            ticketCount={stats.overdueCount}
            tickets={overdueData?.issues?.slice(0, 5).map(issue => ({
              key: issue.key,
              summary: issue.fields.summary,
              assignee: issue.fields.assignee?.displayName || 'Unassigned',
              status: issue.fields.status.name,
              component: issue.fields.components?.[0]?.name || 'No Component'
            })) || []}
          />
        )}
        
        {stats.missingComponentsCount > 50 && (
          <CaseCrisisAlert 
            caseNumber={`COMPONENTS-CRISIS-${stats.missingComponentsCount}`}
            ticketCount={stats.missingComponentsCount}
            tickets={missingComponentData?.issues?.slice(0, 5).map(issue => ({
              key: issue.key,
              summary: issue.fields.summary,
              assignee: issue.fields.assignee?.displayName || 'Unassigned',
              status: issue.fields.status.name,
              component: issue.fields.components?.[0]?.name || 'No Component'
            })) || []}
          />
        )}
        
        {stats.dataTeamNewCount > 5 && (
          <CaseCrisisAlert 
            caseNumber={`DATA-TEAM-CRISIS-${stats.dataTeamNewCount}`}
            ticketCount={stats.dataTeamNewCount}
            tickets={dataTeamNewData?.issues?.slice(0, 5).map(issue => ({
              key: issue.key,
              summary: issue.fields.summary,
              assignee: issue.fields.assignee?.displayName || 'Unassigned',
              status: issue.fields.status.name,
              component: issue.fields.components?.[0]?.name || 'No Component'
            })) || []}
          />
        )}

        {/* Main Content Tabs */}
        <TabView className="w-full">
          <TabPanel header="Workflow Overview" leftIcon="pi pi-sitemap mr-2">
            <div className="space-y-6">
              <WorkflowChart 
                tickets={allTickets}
                title="Status Distribution"
                className="mb-6"
              />
              <StatusKanban 
                tickets={allTickets}
                title="Status Kanban Board"
              />
            </div>
          </TabPanel>

          <TabPanel header="Analytics" leftIcon="pi pi-chart-bar mr-2">
            <AnalyticsDashboard 
              tickets={allTickets}
              className="w-full"
            />
          </TabPanel>

          <TabPanel header="Team Performance" leftIcon="pi pi-users mr-2">
            <TeamOrgChart 
              tickets={allTickets}
              title="Team Organization & Performance"
              className="w-full"
            />
          </TabPanel>

          <TabPanel header="Ticket Management" leftIcon="pi pi-table mr-2">
            <AdvancedDataTable 
              tickets={allTickets}
              title="Advanced Ticket Management"
              onTicketClick={handleTicketClick}
              className="w-full"
            />
          </TabPanel>
        </TabView>

        {/* Toast Manager */}
        <ToastManager
          tickets={allTickets}
          previousTickets={[]}
          overdueCount={stats.overdueCount}
          previousOverdueCount={0}
          missingComponentsCount={stats.missingComponentsCount}
          previousMissingComponentsCount={0}
          dataTeamNewCount={stats.dataTeamNewCount}
          previousDataTeamNewCount={0}
        />

        {/* Dialogs */}
        <TicketDetailsDialog
          ticket={selectedTicket}
          visible={showTicketDialog}
          onHide={() => setShowTicketDialog(false)}
        />

        <CrisisManagementDialog
          visible={showCrisisDialog}
          onHide={() => setShowCrisisDialog(false)}
          crisisData={crisisData}
        />
      </div>
    </div>
  );
}
