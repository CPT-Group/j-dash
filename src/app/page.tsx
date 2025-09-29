'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  Activity,
  Target,
  Zap,
  AlertTriangle,
  User,
  Database,
  Globe,
  FileText
} from 'lucide-react';

// Import our custom components
import DashboardHeader from '@/components/DashboardHeader';
import MetricCard from '@/components/MetricCard';
import OverdueTicketsList from '@/components/OverdueTicketsList';
import DataView from '@/components/DataView';
import ToastManager from '@/components/ToastManager';
// JiraAPI is now used server-side only

// Real data interfaces
interface DashboardStats {
  overdueCount: number;
  dueTodayCount: number;
  missingComponentsCount: number;
  activeTeamMembers: number;
  totalTickets: number;
  completedToday: number;
}

interface Ticket {
  key: string;
  summary: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate?: string;
  component?: string;
  issueType: string;
  created: string;
  updated: string;
  storyPoints?: number;
}

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState('CM');
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Real data state
  const [stats, setStats] = useState<DashboardStats>({
    overdueCount: 0,
    dueTodayCount: 0,
    missingComponentsCount: 0,
    activeTeamMembers: 3,
    totalTickets: 0,
    completedToday: 0,
  });
  const [overdueTickets, setOverdueTickets] = useState<Ticket[]>([]);
  const [dueTodayTickets, setDueTodayTickets] = useState<Ticket[]>([]);
  const [missingComponentTickets, setMissingComponentTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  
  // Previous state for toast comparisons
  const [previousTickets, setPreviousTickets] = useState<Ticket[]>([]);
  const [previousOverdueCount, setPreviousOverdueCount] = useState(0);
  const [previousMissingComponentsCount, setPreviousMissingComponentsCount] = useState(0);
  const [previousDataTeamNewCount, setPreviousDataTeamNewCount] = useState(0);

  const projects = [
    { label: 'Case Management (CM)', value: 'CM' },
    { label: 'CPT Prod Support (OPRD)', value: 'OPRD' },
    { label: 'NCOA Alteryx (NA)', value: 'NA' },
    { label: 'Form Elements Data Entry (FEDA)', value: 'FEDA' },
  ];

  // Helper function to make API calls to our server-side route
  const fetchJiraData = async (endpoint: string, params: Record<string, string> = {}) => {
    const searchParams = new URLSearchParams({ endpoint, ...params });
    const response = await fetch(`/api/jira?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  };

  const fetchDashboardData = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      // Fetch overdue tickets
      const overdueData = await fetchJiraData('search', {
        jql: 'assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) AND duedate < now() AND status != Done ORDER BY duedate ASC'
      });
      
      // Fetch due today tickets
      const today = new Date().toISOString().split('T')[0];
      const dueTodayData = await fetchJiraData('search', {
        jql: `assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) AND duedate = "${today}" AND status != Done ORDER BY priority DESC`
      });
      
      // Fetch missing component tickets
      const missingComponentData = await fetchJiraData('search', {
        jql: 'assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) AND component is EMPTY ORDER BY updated DESC'
      });
      
      // Fetch all data team tickets
      const allTicketsData = await fetchJiraData('search', {
        jql: 'assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) ORDER BY updated DESC'
      });

      // Process tickets
      const processTickets = (tickets: any[]): Ticket[] => {
        return tickets.map(ticket => ({
          key: ticket.key,
          summary: ticket.fields.summary,
          assignee: ticket.fields.assignee?.displayName || 'Unassigned',
          status: ticket.fields.status.name,
          priority: ticket.fields.priority?.name || 'None',
          dueDate: ticket.fields.duedate,
          component: ticket.fields.components?.[0]?.name || 'No Component',
          issueType: ticket.fields.issuetype.name,
          created: ticket.fields.created,
          updated: ticket.fields.updated,
          storyPoints: ticket.fields.customfield_10016,
        }));
      };

      const overdueTickets = processTickets(overdueData.issues);
      const dueTodayTickets = processTickets(dueTodayData.issues);
      const missingComponentTickets = processTickets(missingComponentData.issues);
      const allTickets = processTickets(allTicketsData.issues);

      // Calculate stats
      const newStats: DashboardStats = {
        overdueCount: overdueData.total,
        dueTodayCount: dueTodayData.total,
        missingComponentsCount: missingComponentData.total,
        activeTeamMembers: 3,
        totalTickets: allTicketsData.total,
        completedToday: allTickets.filter(t => t.status === 'Done' && 
          new Date(t.updated).toDateString() === new Date().toDateString()).length,
      };

      // Update previous state before setting new state
      setPreviousTickets(allTickets);
      setPreviousOverdueCount(stats.overdueCount);
      setPreviousMissingComponentsCount(stats.missingComponentsCount);
      setPreviousDataTeamNewCount(allTickets.filter(t => t.status === 'Data Team New').length);

      setStats(newStats);
      setOverdueTickets(overdueTickets);
      setDueTodayTickets(dueTodayTickets);
      setMissingComponentTickets(missingComponentTickets);
      setAllTickets(allTickets);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchDashboardData();
      // Refresh every 10 minutes
      const interval = setInterval(fetchDashboardData, 600000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Auto-connect since we're using environment variables
  useEffect(() => {
    setIsConnected(true);
  }, []);

  return (
    <div className="min-h-screen bg-synth-bg-primary">
      {/* Toast Notifications */}
      <ToastManager
        tickets={allTickets}
        previousTickets={previousTickets}
        overdueCount={stats.overdueCount}
        previousOverdueCount={previousOverdueCount}
        missingComponentsCount={stats.missingComponentsCount}
        previousMissingComponentsCount={previousMissingComponentsCount}
        dataTeamNewCount={allTickets.filter(t => t.status === 'Data Team New').length}
        previousDataTeamNewCount={previousDataTeamNewCount}
      />
      
      {/* Header with Live Stats */}
      <DashboardHeader stats={stats} lastUpdated={lastUpdated} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!isConnected ? (
          <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
              <div className="text-center">
                <div className="bg-synth-neon-purple/20 p-6 rounded-lg mb-6">
                  <Activity className="w-16 h-16 text-synth-neon-purple mx-auto animate-glow" />
                </div>
                <h2 className="text-3xl font-bold text-synth-text-bright mb-4">Loading Jira Data</h2>
                <p className="text-synth-text-muted mb-6">
                  Connecting to CPT Group Jira and fetching your project data...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-synth-neon-purple"></div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
            {/* Critical Metrics - Based on Real Data Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Component Assignment Crisis"
                value={stats.missingComponentsCount}
                icon={AlertCircle}
                color="red"
                glow={stats.missingComponentsCount > 50}
                urgent={stats.missingComponentsCount > 50}
                subtitle={`${stats.missingComponentsCount} tickets uncategorized - James manually assigns every morning`}
              />
              <MetricCard
                title="Data Team New Bottleneck"
                value={allTickets.filter(t => t.status === 'Data Team New').length}
                icon={Clock}
                color="orange"
                glow={allTickets.filter(t => t.status === 'Data Team New').length > 3}
                urgent={allTickets.filter(t => t.status === 'Data Team New').length > 3}
                subtitle={`${allTickets.filter(t => t.status === 'Data Team New').length} tickets stuck - Avg 14.7 days`}
              />
              <MetricCard
                title="Case 23CV010356 Crisis"
                value={allTickets.filter(t => t.summary.includes('23CV010356')).length}
                icon={Target}
                color="red"
                glow={allTickets.filter(t => t.summary.includes('23CV010356')).length > 0}
                urgent={allTickets.filter(t => t.summary.includes('23CV010356')).length > 0}
                subtitle={`${allTickets.filter(t => t.summary.includes('23CV010356')).length} tickets for single case - All missing components`}
              />
              <MetricCard
                title="Overdue Tickets"
                value={stats.overdueCount}
                icon={AlertTriangle}
                color="red"
                glow={stats.overdueCount > 20}
                urgent={stats.overdueCount > 20}
                subtitle={`${stats.overdueCount} tickets overdue - 53+ tickets 53+ days overdue`}
              />
            </div>

            {/* Overdue Tickets - Most Critical */}
            {stats.overdueCount > 0 && (
              <div className="mb-8">
                <OverdueTicketsList 
                  tickets={overdueTickets.map(ticket => ({
                    ...ticket,
                    daysOverdue: ticket.dueDate ? 
                      Math.floor((new Date().getTime() - new Date(ticket.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
                  }))}
                  maxDisplay={5}
                />
        </div>
            )}

            {/* Due Today Tickets */}
            {stats.dueTodayCount > 0 && (
              <div className="mb-8">
                <DataView
                  tickets={dueTodayTickets}
                  title="Due Today - Urgent Priority"
                  viewType="grid"
                  onTicketClick={(ticket) => {
                    window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank');
                  }}
                />
              </div>
            )}

            {/* Missing Components */}
            {stats.missingComponentsCount > 0 && (
              <div className="mb-8">
                <DataView
                  tickets={missingComponentTickets}
                  title="Missing Components - Needs Attention"
                  viewType="list"
                  onTicketClick={(ticket) => {
                    window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank');
                  }}
                />
              </div>
            )}

            {/* All Tickets Overview */}
            <div className="mb-8">
              <DataView
                tickets={allTickets}
                title="All Data Team Tickets"
                viewType="grid"
                showFilters={true}
                onTicketClick={(ticket) => {
                  window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank');
                }}
              />
            </div>

            {/* Crisis Alert Banner */}
            {(stats.missingComponentsCount > 50 || allTickets.filter(t => t.status === 'Data Team New').length > 3 || allTickets.filter(t => t.summary.includes('23CV010356')).length > 0) && (
              <div className="mb-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 rounded-lg p-6 animate-pulse-slow">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
                  <h2 className="text-2xl font-bold text-red-400">🚨 CRISIS ALERT 🚨</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.missingComponentsCount > 50 && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-red-300 mb-2">Component Assignment Crisis</h3>
                      <p className="text-red-200 text-sm">
                        {stats.missingComponentsCount} tickets missing components. James manually assigns every morning - this is unsustainable!
                      </p>
                    </div>
                  )}
                  {allTickets.filter(t => t.status === 'Data Team New').length > 3 && (
                    <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-orange-300 mb-2">Data Team New Bottleneck</h3>
                      <p className="text-orange-200 text-sm">
                        {allTickets.filter(t => t.status === 'Data Team New').length} tickets stuck in Data Team New. Average 14.7 days - workflow is broken!
                      </p>
                    </div>
                  )}
                  {allTickets.filter(t => t.summary.includes('23CV010356')).length > 0 && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-red-300 mb-2">Case 23CV010356 Crisis</h3>
                      <p className="text-red-200 text-sm">
                        {allTickets.filter(t => t.summary.includes('23CV010356')).length} tickets for single case. All missing components - resource drain!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Team Performance by Component - Real Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-synth-neon-purple/20 rounded-lg">
                    <Globe className="w-6 h-6 text-synth-neon-purple" />
                  </div>
                  <h3 className="text-lg font-bold text-synth-text-bright">Kyle - Websites</h3>
                </div>
                <div className="text-3xl font-bold text-synth-neon-purple mb-2">
                  {allTickets.filter(t => t.assignee === 'Kyle Dilbeck' && (t.component?.includes('Website') || t.summary.includes('Website'))).length}
                </div>
                <p className="text-synth-text-muted text-sm">Website tickets assigned</p>
                <div className="mt-2 text-xs text-synth-text-muted">
                  Data Team New: {allTickets.filter(t => t.assignee === 'Kyle Dilbeck' && t.status === 'Data Team New').length} | 
                  Missing Components: {allTickets.filter(t => t.assignee === 'Kyle Dilbeck' && t.component === 'No Component').length}
                </div>
              </Card>

              <Card>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-synth-neon-cyan/20 rounded-lg">
                    <Database className="w-6 h-6 text-synth-neon-cyan" />
                  </div>
                  <h3 className="text-lg font-bold text-synth-text-bright">James - Database</h3>
                </div>
                <div className="text-3xl font-bold text-synth-neon-cyan mb-2">
                  {allTickets.filter(t => t.assignee === 'James Cassidy' && (t.component?.includes('Database') || t.component?.includes('Data') || t.summary.includes('Database'))).length}
                </div>
                <p className="text-synth-text-muted text-sm">Database tickets assigned</p>
                <div className="mt-2 text-xs text-synth-text-muted">
                  Development: {allTickets.filter(t => t.assignee === 'James Cassidy' && t.status === 'DEVELOPMENT').length} | 
                  PEER TESTING: {allTickets.filter(t => t.assignee === 'James Cassidy' && t.status === 'PEER TESTING').length}
                </div>
              </Card>

              <Card>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-synth-neon-green/20 rounded-lg">
                    <FileText className="w-6 h-6 text-synth-neon-green" />
                  </div>
                  <h3 className="text-lg font-bold text-synth-text-bright">Thomas - Reports</h3>
                </div>
                <div className="text-3xl font-bold text-synth-neon-green mb-2">
                  {allTickets.filter(t => t.assignee === 'Thomas Williams' && (t.component?.includes('Report') || t.summary.includes('Report'))).length}
                </div>
                <p className="text-synth-text-muted text-sm">Report tickets assigned</p>
                <div className="mt-2 text-xs text-synth-text-muted">
                  To Do: {allTickets.filter(t => t.assignee === 'Thomas Williams' && t.status === 'To Do').length} | 
                  Completed: {allTickets.filter(t => t.assignee === 'Thomas Williams' && t.status === 'Completed').length}
                </div>
              </Card>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <Card className="fixed top-4 right-4 z-50">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-synth-neon-purple"></div>
                  <span className="text-synth-text-primary text-sm">Updating data...</span>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
