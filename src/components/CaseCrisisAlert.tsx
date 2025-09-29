'use client';

import { AlertTriangle, ExternalLink, Users, Database, Globe } from 'lucide-react';

interface CaseCrisisAlertProps {
  caseNumber?: string;
  ticketCount?: number;
  tickets?: Array<{
    key: string;
    summary: string;
    assignee: string;
    status: string;
    component: string;
  }>;
}

export default function CaseCrisisAlert({ caseNumber, ticketCount, tickets }: CaseCrisisAlertProps) {
  const getComponentIcon = (component: string) => {
    if (component.includes('Website') || component.includes('Web')) return Globe;
    if (component.includes('Database') || component.includes('Data')) return Database;
    return Users;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'data team new':
        return 'text-synth-neon-yellow bg-synth-neon-yellow/20 border-synth-neon-yellow/50';
      case 'to do':
        return 'text-synth-neon-orange bg-synth-neon-orange/20 border-synth-neon-orange/50';
      case 'completed':
        return 'text-synth-neon-green bg-synth-neon-green/20 border-synth-neon-green/50';
      default:
        return 'text-synth-text-muted bg-synth-bg-hover border-synth-border-primary';
    }
  };

  return (
    <div className="bg-synth-status-error/10 border-2 border-synth-status-error/50 rounded-lg p-6 mb-8 animate-neon-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-synth-status-error/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-synth-status-error" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-synth-text-bright">
              CASE CRISIS ALERT
            </h3>
            <p className="text-synth-text-muted">
              Case {caseNumber} has {ticketCount} tickets - ALL missing components!
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-synth-status-error">
            {ticketCount}
          </div>
          <div className="text-sm text-synth-text-muted">
            tickets affected
          </div>
        </div>
      </div>

      <div className="bg-synth-bg-card border border-synth-border-primary rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(tickets || []).slice(0, 9).map((ticket, index) => {
            const Icon = getComponentIcon(ticket.component);
            return (
              <div
                key={ticket.key}
                className="bg-synth-bg-hover border border-synth-border-secondary rounded-lg p-3 hover:border-synth-border-accent transition-colors cursor-pointer group"
                onClick={() => window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank')}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-synth-text-muted" />
                    <span className="font-mono text-synth-neon-cyan font-bold text-sm">
                      {ticket.key}
                    </span>
                    <ExternalLink className="w-3 h-3 text-synth-text-muted group-hover:text-synth-neon-purple transition-colors" />
                  </div>
                </div>
                <p className="text-synth-text-primary text-sm mb-2 line-clamp-2">
                  {ticket.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-synth-text-muted text-xs">
                    {ticket.assignee}
                  </span>
                  <span className={`
                    px-2 py-1 rounded text-xs font-medium border
                    ${getStatusColor(ticket.status)}
                  `}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {(tickets || []).length > 9 && (
          <div className="mt-4 text-center">
            <span className="text-synth-text-muted text-sm">
              +{(tickets || []).length - 9} more tickets in this case
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-synth-status-error/20 border border-synth-status-error/50 rounded-lg">
        <div className="flex items-center space-x-2 text-synth-status-error font-medium">
          <AlertTriangle className="w-4 h-4" />
          <span>IMMEDIATE ACTION REQUIRED: All tickets need component assignment</span>
        </div>
      </div>
    </div>
  );
}
