'use client';

import { ExternalLink, Clock, User, AlertCircle, CheckCircle, Play, Pause } from 'lucide-react';

interface TicketCardProps {
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
  onClick?: () => void;
}

export default function TicketCard({
  key,
  summary,
  assignee,
  status,
  priority,
  dueDate,
  component,
  issueType,
  created,
  updated,
  storyPoints,
  onClick
}: TicketCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-synth-neon-green" />;
      case 'in progress':
      case 'data team in progress':
      case 'development':
        return <Play className="w-4 h-4 text-synth-neon-cyan" />;
      case 'to do':
      case 'data team new':
      case 'requested':
        return <Pause className="w-4 h-4 text-synth-neon-yellow" />;
      default:
        return <AlertCircle className="w-4 h-4 text-synth-neon-orange" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
      case 'resolved':
        return 'bg-synth-neon-green/20 border-synth-neon-green/50 text-synth-neon-green';
      case 'in progress':
      case 'data team in progress':
      case 'development':
        return 'bg-synth-neon-cyan/20 border-synth-neon-cyan/50 text-synth-neon-cyan';
      case 'to do':
      case 'data team new':
      case 'requested':
        return 'bg-synth-neon-yellow/20 border-synth-neon-yellow/50 text-synth-neon-yellow';
      default:
        return 'bg-synth-neon-orange/20 border-synth-neon-orange/50 text-synth-neon-orange';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'highest':
        return 'bg-synth-status-error/20 border-synth-status-error/50 text-synth-status-error';
      case 'high':
        return 'bg-synth-neon-orange/20 border-synth-neon-orange/50 text-synth-neon-orange';
      case 'medium':
        return 'bg-synth-neon-yellow/20 border-synth-neon-yellow/50 text-synth-neon-yellow';
      case 'low':
        return 'bg-synth-neon-green/20 border-synth-neon-green/50 text-synth-neon-green';
      default:
        return 'bg-synth-text-muted/20 border-synth-text-muted/50 text-synth-text-muted';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = dueDate ? getDaysUntilDue(dueDate) < 0 : false;
  const daysUntilDue = dueDate ? Math.abs(getDaysUntilDue(dueDate)) : null;

  return (
    <div 
      className="bg-synth-bg-card border border-synth-border-primary rounded-lg p-4 hover:border-synth-border-accent transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-synth-neon-cyan font-bold text-sm">
            {key}
          </span>
          <ExternalLink className="w-3 h-3 text-synth-text-muted group-hover:text-synth-neon-purple transition-colors" />
        </div>
        <div className="flex items-center space-x-2">
          {storyPoints && (
            <span className="bg-synth-bg-hover px-2 py-1 rounded text-xs text-synth-text-muted">
              {storyPoints} pts
            </span>
          )}
          <span className={`
            px-2 py-1 rounded text-xs font-medium border
            ${getPriorityColor(priority)}
          `}>
            {priority}
          </span>
        </div>
      </div>

      {/* Summary */}
      <h4 className="text-synth-text-primary font-medium mb-3 line-clamp-2">
        {summary}
      </h4>

      {/* Status and Component */}
      <div className="flex items-center space-x-2 mb-3">
        <div className={`
          flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border
          ${getStatusColor(status)}
        `}>
          {getStatusIcon(status)}
          <span>{status}</span>
        </div>
        {component && component !== 'No Component' && (
          <span className="bg-synth-bg-hover px-2 py-1 rounded text-xs text-synth-text-muted">
            {component}
          </span>
        )}
        {(!component || component === 'No Component') && (
          <span className="bg-synth-status-error/20 border border-synth-status-error/50 text-synth-status-error px-2 py-1 rounded text-xs">
            No Component
          </span>
        )}
      </div>

      {/* Assignee and Due Date */}
      <div className="flex items-center justify-between text-xs text-synth-text-muted">
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3" />
          <span>{assignee}</span>
        </div>
        {dueDate && (
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span className={isOverdue ? 'text-synth-status-error font-bold' : ''}>
              {isOverdue ? `${daysUntilDue} days overdue` : `Due in ${daysUntilDue} days`}
            </span>
          </div>
        )}
      </div>

      {/* Issue Type */}
      <div className="mt-2 text-xs text-synth-text-muted">
        {issueType}
      </div>
    </div>
  );
}
