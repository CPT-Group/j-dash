'use client';

import { AlertTriangle, Clock, User } from 'lucide-react';

interface OverdueTicket {
  key: string;
  summary: string;
  assignee: string;
  dueDate: string;
  daysOverdue: number;
  priority: string;
  status: string;
}

interface OverdueTicketsListProps {
  tickets: OverdueTicket[];
  maxDisplay?: number;
}

export default function OverdueTicketsList({ tickets, maxDisplay = 10 }: OverdueTicketsListProps) {
  const safeTickets = tickets || [];
  const displayTickets = safeTickets.slice(0, maxDisplay);
  const remainingCount = Math.max(0, safeTickets.length - maxDisplay);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'highest':
        return 'text-synth-status-error border-synth-status-error/50';
      case 'high':
        return 'text-synth-neon-orange border-synth-neon-orange/50';
      case 'medium':
        return 'text-synth-neon-yellow border-synth-neon-yellow/50';
      default:
        return 'text-synth-text-muted border-synth-border-primary';
    }
  };

  const getDaysOverdueColor = (days: number) => {
    if (days > 30) return 'text-synth-status-error';
    if (days > 7) return 'text-synth-neon-orange';
    return 'text-synth-neon-yellow';
  };

  return (
    <div className="bg-synth-bg-card border border-synth-border-primary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-synth-status-error/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-synth-status-error" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-synth-text-bright">
              Overdue Tickets
            </h3>
            <p className="text-synth-text-muted text-sm">
              {safeTickets.length} total overdue tickets
            </p>
          </div>
        </div>
        {remainingCount > 0 && (
          <div className="text-synth-text-muted text-sm">
            +{remainingCount} more
          </div>
        )}
      </div>

      <div className="space-y-3">
        {displayTickets.map((ticket, index) => (
          <div
            key={ticket.key}
            className="bg-synth-bg-hover border border-synth-border-secondary rounded-lg p-4 hover:border-synth-border-accent transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-mono text-synth-neon-cyan font-bold">
                    {ticket.key}
                  </span>
                  <span className={`
                    px-2 py-1 rounded text-xs font-medium border
                    ${getPriorityColor(ticket.priority)}
                  `}>
                    {ticket.priority}
                  </span>
                  <span className="text-synth-text-muted text-sm">
                    {ticket.status}
                  </span>
                </div>
                <p className="text-synth-text-primary text-sm mb-2">
                  {ticket.summary}
                </p>
                <div className="flex items-center space-x-4 text-xs text-synth-text-muted">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{ticket.assignee}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Due: {new Date(ticket.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`
                  text-lg font-bold
                  ${getDaysOverdueColor(ticket.daysOverdue)}
                `}>
                  {ticket.daysOverdue}
                </div>
                <div className="text-xs text-synth-text-muted">
                  days overdue
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {safeTickets.length === 0 && (
        <div className="text-center py-8">
          <div className="text-synth-neon-green text-4xl mb-2">✓</div>
          <p className="text-synth-text-muted">No overdue tickets!</p>
        </div>
      )}
    </div>
  );
}
