'use client';

import { useState } from 'react';
import { Grid, List, BarChart3, Filter, ExternalLink } from 'lucide-react';
import TicketCard from './TicketCard';

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

interface DataViewProps {
  tickets: Ticket[];
  title: string;
  viewType?: 'grid' | 'list' | 'chart';
  showFilters?: boolean;
  onTicketClick?: (ticket: Ticket) => void;
}

export default function DataView({ 
  tickets, 
  title, 
  viewType = 'grid',
  showFilters = true,
  onTicketClick 
}: DataViewProps) {
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'chart'>(viewType);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  // Get unique values for filters
  const safeTickets = tickets || [];
  const statuses = [...new Set(safeTickets.map(t => t.status))];
  const priorities = [...new Set(safeTickets.map(t => t.priority))];
  const assignees = [...new Set(safeTickets.map(t => t.assignee))];

  // Filter tickets
  const filteredTickets = safeTickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    const assigneeMatch = filterAssignee === 'all' || ticket.assignee === filterAssignee;
    return statusMatch && priorityMatch && assigneeMatch;
  });

  const handleTicketClick = (ticket: Ticket) => {
    if (onTicketClick) {
      onTicketClick(ticket);
    } else {
      // Default behavior: open Jira ticket in new tab
      const jiraUrl = `https://cptgroup.atlassian.net/browse/${ticket.key}`;
      window.open(jiraUrl, '_blank');
    }
  };

  const getStatusCounts = () => {
    const counts: { [key: string]: number } = {};
    filteredTickets.forEach(ticket => {
      counts[ticket.status] = (counts[ticket.status] || 0) + 1;
    });
    return counts;
  };

  const getPriorityCounts = () => {
    const counts: { [key: string]: number } = {};
    filteredTickets.forEach(ticket => {
      counts[ticket.priority] = (counts[ticket.priority] || 0) + 1;
    });
    return counts;
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredTickets.map((ticket) => (
        <TicketCard
          key={ticket.key}
          ticketKey={ticket.key}
          summary={ticket.summary}
          assignee={ticket.assignee}
          status={ticket.status}
          priority={ticket.priority}
          dueDate={ticket.dueDate}
          component={ticket.component}
          issueType={ticket.issueType}
          created={ticket.created}
          updated={ticket.updated}
          storyPoints={ticket.storyPoints}
          onClick={() => handleTicketClick(ticket)}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredTickets.map((ticket) => (
        <div
          key={ticket.key}
          className="bg-synth-bg-card border border-synth-border-primary rounded-lg p-4 hover:border-synth-border-accent transition-all duration-300 cursor-pointer group"
          onClick={() => handleTicketClick(ticket)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-synth-neon-cyan font-bold">
                {ticket.key}
              </span>
              <span className="text-synth-text-primary font-medium flex-1">
                {ticket.summary}
              </span>
              <ExternalLink className="w-4 h-4 text-synth-text-muted group-hover:text-synth-neon-purple transition-colors" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-synth-text-muted text-sm">{ticket.assignee}</span>
              <span className="text-synth-text-muted text-sm">{ticket.status}</span>
              <span className="text-synth-text-muted text-sm">{ticket.priority}</span>
              {ticket.dueDate && (
                <span className="text-synth-text-muted text-sm">
                  Due: {new Date(ticket.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChartView = () => {
    const statusCounts = getStatusCounts();
    const priorityCounts = getPriorityCounts();

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-synth-bg-card border border-synth-border-primary rounded-lg p-6">
          <h4 className="text-synth-text-bright font-bold mb-4">Status Distribution</h4>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-synth-text-primary">{status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-synth-bg-hover rounded-full h-2">
                    <div 
                      className="bg-synth-neon-purple h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / filteredTickets.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-synth-text-bright font-bold w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Chart */}
        <div className="bg-synth-bg-card border border-synth-border-primary rounded-lg p-6">
          <h4 className="text-synth-text-bright font-bold mb-4">Priority Distribution</h4>
          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="text-synth-text-primary">{priority}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-synth-bg-hover rounded-full h-2">
                    <div 
                      className="bg-synth-neon-cyan h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / filteredTickets.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-synth-text-bright font-bold w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-synth-bg-card border border-synth-border-primary rounded-lg">
      {/* Header */}
      <div className="border-b border-synth-border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-synth-text-bright">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('grid')}
              className={`p-2 rounded ${currentView === 'grid' ? 'bg-synth-neon-purple/20 text-synth-neon-purple' : 'text-synth-text-muted hover:text-synth-text-primary'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`p-2 rounded ${currentView === 'list' ? 'bg-synth-neon-purple/20 text-synth-neon-purple' : 'text-synth-text-muted hover:text-synth-text-primary'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('chart')}
              className={`p-2 rounded ${currentView === 'chart' ? 'bg-synth-neon-purple/20 text-synth-neon-purple' : 'text-synth-text-muted hover:text-synth-text-primary'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-synth-text-muted" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-synth-bg-hover border border-synth-border-primary rounded px-3 py-1 text-synth-text-primary text-sm"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-synth-bg-hover border border-synth-border-primary rounded px-3 py-1 text-synth-text-primary text-sm"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="bg-synth-bg-hover border border-synth-border-primary rounded px-3 py-1 text-synth-text-primary text-sm"
            >
              <option value="all">All Assignees</option>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4 text-sm text-synth-text-muted">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
        
        {currentView === 'grid' && renderGridView()}
        {currentView === 'list' && renderListView()}
        {currentView === 'chart' && renderChartView()}
      </div>
    </div>
  );
}
