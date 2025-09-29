'use client';

import { Panel } from 'primereact/panel';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { AlertTriangle, ExternalLink, CheckCircle, Clock, Database, Activity, Users } from 'lucide-react';

interface Ticket {
  key: string;
  summary: string;
  assignee: string;
  status: string;
  component?: string;
}

interface CrisisAlertProps {
  caseNumber?: string;
  ticketCount?: number;
  tickets?: Ticket[];
  alertType: 'overdue' | 'components' | 'data-team' | 'completed' | 'workload';
}

export default function CrisisAlert({ 
  caseNumber, 
  ticketCount = 0, 
  tickets = [],
  alertType
}: CrisisAlertProps) {
  if (ticketCount === 0) return null;

  const getAlertConfig = () => {
    switch (alertType) {
      case 'overdue':
        return {
          icon: <Clock className="w-5 h-5" />,
          title: 'Overdue Tickets',
          description: `${ticketCount} tickets are overdue and need immediate attention`,
          color: 'red',
          severity: 'danger' as const,
          headerClass: 'border-red-500 bg-red-900/10',
          contentClass: 'bg-red-900/20 border-red-500/30'
        };
      case 'components':
        return {
          icon: <Database className="w-5 h-5" />,
          title: 'Missing Components',
          description: `${ticketCount} tickets are missing component assignments`,
          color: 'orange',
          severity: 'warning' as const,
          headerClass: 'border-orange-500 bg-orange-900/10',
          contentClass: 'bg-orange-900/20 border-orange-500/30'
        };
      case 'data-team':
        return {
          icon: <Activity className="w-5 h-5" />,
          title: 'Data Team Bottleneck',
          description: `${ticketCount} tickets stuck in Data Team New status`,
          color: 'purple',
          severity: 'info' as const,
          headerClass: 'border-purple-500 bg-purple-900/10',
          contentClass: 'bg-purple-900/20 border-purple-500/30'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          title: 'Recently Completed Tickets',
          description: `${ticketCount} tickets have been completed recently`,
          color: 'green',
          severity: 'success' as const,
          headerClass: 'border-green-500 bg-green-900/10',
          contentClass: 'bg-green-900/20 border-green-500/30'
        };
      case 'workload':
        return {
          icon: <Users className="w-5 h-5" />,
          title: 'Workload Imbalance',
          description: `Severe workload imbalance detected across team members`,
          color: 'yellow',
          severity: 'warning' as const,
          headerClass: 'border-yellow-500 bg-yellow-900/10',
          contentClass: 'bg-yellow-900/20 border-yellow-500/30'
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'Alert',
          description: `${ticketCount} tickets need attention`,
          color: 'gray',
          severity: 'info' as const,
          headerClass: 'border-gray-500 bg-gray-900/10',
          contentClass: 'bg-gray-900/20 border-gray-500/30'
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Panel 
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className={`text-${config.color}-400`}>
              {config.icon}
            </div>
            <div>
              <h3 className={`text-lg font-semibold text-${config.color}-400`}>
                {config.title}
              </h3>
              <p className={`text-${config.color}-300 text-sm`}>
                {config.description}
              </p>
            </div>
          </div>
          <Badge 
            value={ticketCount} 
            severity={config.severity}
            className="text-lg px-3 py-1"
          />
        </div>
      }
      className={`mb-4 ${config.headerClass}`}
      toggleable
      collapsed={false}
    >
      <div className="space-y-2">
        {tickets.slice(0, 5).map((ticket) => (
          <div 
            key={ticket.key}
            className={`flex items-center justify-between p-3 ${config.contentClass} rounded-lg hover:opacity-80 transition-opacity cursor-pointer`}
            onClick={() => window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank')}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className={`font-mono text-${config.color}-300 font-bold`}>
                {ticket.key}
              </span>
              <span className={`text-${config.color}-200 flex-1`}>
                {ticket.summary}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                value={ticket.status} 
                severity="info" 
                className="text-xs"
              />
              <Badge 
                value={ticket.assignee} 
                severity="secondary" 
                className="text-xs"
              />
              <ExternalLink className={`w-4 h-4 text-${config.color}-400`} />
            </div>
          </div>
        ))}
        
        {tickets.length > 5 && (
          <div className={`text-center text-${config.color}-300 text-sm`}>
            ... and {tickets.length - 5} more tickets
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          label="View All Tickets"
          icon={<ExternalLink className="w-4 h-4" />}
          className={`p-button-outlined p-button-${config.color === 'red' ? 'danger' : config.color === 'orange' ? 'warning' : config.color === 'purple' ? 'info' : config.color === 'green' ? 'success' : 'info'}`}
          onClick={() => {
            console.log('View all tickets for:', caseNumber);
          }}
        />
      </div>
    </Panel>
  );
}