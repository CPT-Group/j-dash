'use client';

import { OrderList } from 'primereact/orderlist';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Ticket } from '@/types/components/tickets';
import { useState, useEffect } from 'react';

interface StatusKanbanProps {
  tickets: Ticket[];
  title?: string;
  className?: string;
}

interface StatusGroup {
  status: string;
  tickets: Ticket[];
  color: string;
  priority: number;
}

export default function StatusKanban({ 
  tickets, 
  title = "Status Kanban Board",
  className = ""
}: StatusKanbanProps) {
  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([]);

  // Define status configuration
  const statusConfig = {
    // Data Team Workflow
    'New': { color: '#3B82F6', priority: 1, category: 'Initial' },
    'Requested': { color: '#8B5CF6', priority: 2, category: 'Initial' },
    'Data Team New': { color: '#EF4444', priority: 3, category: 'Data Team' },
    'Data Team In Progress': { color: '#F59E0B', priority: 4, category: 'Data Team' },
    'Data Team Testing': { color: '#10B981', priority: 5, category: 'Data Team' },
    'Data Team Complete': { color: '#06B6D4', priority: 6, category: 'Data Team' },
    'Request Complete': { color: '#84CC16', priority: 7, category: 'Final' },
    'Completed': { color: '#22C55E', priority: 8, category: 'Final' },
    
    // OPRD Workflow
    'To Do': { color: '#6B7280', priority: 1, category: 'Initial' },
    'REQUIREMENT REVIEW': { color: '#8B5CF6', priority: 2, category: 'Review' },
    'DEVELOPMENT': { color: '#F59E0B', priority: 3, category: 'Development' },
    'PEER TESTING': { color: '#10B981', priority: 4, category: 'Testing' },
    'QA/QC': { color: '#06B6D4', priority: 5, category: 'Testing' },
    'UAT': { color: '#84CC16', priority: 6, category: 'Testing' },
    'Resolved': { color: '#22C55E', priority: 7, category: 'Final' },
    
    // Other statuses
    'In Progress': { color: '#F59E0B', priority: 3, category: 'Active' },
    'Open': { color: '#EF4444', priority: 2, category: 'Active' },
    'Done': { color: '#22C55E', priority: 8, category: 'Final' }
  };

  // Group tickets by status
  const groupTicketsByStatus = () => {
    const groups: { [key: string]: Ticket[] } = {};
    
    tickets.forEach(ticket => {
      const status = ticket.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(ticket);
    });

    // Convert to StatusGroup array and sort by priority
    const statusGroupsArray = Object.entries(groups).map(([status, tickets]) => {
      const config = statusConfig[status as keyof typeof statusConfig] || { 
        color: '#6B7280', 
        priority: 99, 
        category: 'Other' 
      };
      
      return {
        status,
        tickets,
        color: config.color,
        priority: config.priority
      };
    });

    // Sort by priority
    statusGroupsArray.sort((a, b) => a.priority - b.priority);
    
    setStatusGroups(statusGroupsArray);
  };

  // Initialize groups when tickets change
  useEffect(() => {
    groupTicketsByStatus();
  }, [tickets]);

  const getPrioritySeverity = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'highest': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusSeverity = (status: string) => {
    if (['Data Team New', 'Open'].includes(status)) return 'danger';
    if (['Data Team In Progress', 'DEVELOPMENT', 'In Progress'].includes(status)) return 'warning';
    if (['Data Team Testing', 'PEER TESTING', 'QA/QC', 'UAT'].includes(status)) return 'info';
    if (['Completed', 'Resolved', 'Done'].includes(status)) return 'success';
    return 'secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (ticket: Ticket) => {
    if (!ticket.dueDate) return false;
    return new Date(ticket.dueDate) < new Date();
  };

  const itemTemplate = (ticket: Ticket) => {
    return (
      <div className="p-3 border border-synth-border-primary rounded-lg bg-synth-bg-card hover:bg-synth-bg-hover transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-synth-text-bright text-sm mb-1">
              {ticket.key}
            </h4>
            <p className="text-synth-text-muted text-xs line-clamp-2 mb-2">
              {ticket.summary}
            </p>
          </div>
          {isOverdue(ticket) && (
            <Badge value="Overdue" severity="danger" />
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          <Tag 
            value={ticket.priority || 'Unassigned'}
            severity={getPrioritySeverity(ticket.priority || 'Unassigned')}
          />
          <Tag
            value={ticket.status}
            severity={getStatusSeverity(ticket.status)}
          />
        </div>
        
        <div className="flex justify-between items-center text-xs text-synth-text-muted">
          <span>{ticket.assignee || 'Unassigned'}</span>
          <span>{formatDate(ticket.created)}</span>
        </div>
        
        {ticket.component && (
          <div className="mt-2">
            <Tag 
              value={ticket.component}
              severity="info"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <Card title={title} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {statusGroups.map((group) => (
            <div key={group.status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 
                  className="font-semibold text-lg"
                  style={{ color: group.color }}
                >
                  {group.status}
                </h3>
                <Badge 
                  value={group.tickets.length} 
                  severity="info"
                  size="large"
                />
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <OrderList
                  value={group.tickets}
                  dataKey="key"
                  onChange={(e) => {
                    // Update the tickets in this status group
                    const newGroups = [...statusGroups];
                    const groupIndex = newGroups.findIndex(g => g.status === group.status);
                    if (groupIndex !== -1) {
                      newGroups[groupIndex].tickets = e.value;
                      setStatusGroups(newGroups);
                    }
                  }}
                  itemTemplate={itemTemplate}
                  header={`${group.tickets.length} tickets`}
                  dragdrop
                  className="w-full"
                  pt={{
                    list: { className: 'p-0' },
                    item: { className: 'p-0 mb-2' }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
