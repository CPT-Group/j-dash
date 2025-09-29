'use client';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Calendar, User, Tag, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { Ticket } from '@/types';

interface TicketDetailsDialogProps {
  ticket: Ticket | null;
  visible: boolean;
  onHide: () => void;
}

export default function TicketDetailsDialog({ ticket, visible, onHide }: TicketDetailsDialogProps) {
  if (!ticket) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'highest': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green';
      case 'in progress': return 'blue';
      case 'data team new': return 'purple';
      case 'data team testing': return 'orange';
      case 'request complete': return 'teal';
      case 'new': return 'gray';
      case 'to do': return 'gray';
      case 'uat': return 'cyan';
      case 'waiting': return 'yellow';
      case 'waiting qa': return 'yellow';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isOverdue = ticket.dueDate && new Date(ticket.dueDate) < new Date();
  const daysOverdue = ticket.dueDate && isOverdue ? getDaysOverdue(ticket.dueDate) : 0;

  return (
    <Dialog
      header={`Ticket Details: ${ticket.key}`}
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '800px' }}
      modal
      className="ticket-details-dialog"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-synth-text-bright mb-2">
              {ticket.summary}
            </h2>
            <div className="flex items-center gap-4 text-sm text-synth-text-muted">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {ticket.issueType}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {ticket.assignee}
              </span>
            </div>
          </div>
          <Button
            icon={<ExternalLink className="w-4 h-4" />}
            label="View in Jira"
            className="p-button-outlined p-button-sm"
            onClick={() => window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank')}
          />
        </div>

        <Divider />

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-synth-text-muted mb-2">
              Status
            </label>
            <Badge
              value={ticket.status}
              severity={getStatusColor(ticket.status) as 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-synth-text-muted mb-2">
              Priority
            </label>
            <Badge
              value={ticket.priority}
              severity={getPriorityColor(ticket.priority) as 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'}
              className="text-sm"
            />
          </div>
        </div>

        {/* Due Date with Overdue Warning */}
        {ticket.dueDate && (
          <div>
            <label className="block text-sm font-medium text-synth-text-muted mb-2">
              Due Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-synth-text-muted" />
              <span className="text-synth-text-bright">
                {formatDate(ticket.dueDate)}
              </span>
              {isOverdue && (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {daysOverdue} days overdue
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Component */}
        <div>
          <label className="block text-sm font-medium text-synth-text-muted mb-2">
            Component
          </label>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-synth-text-muted" />
            <span className={`text-synth-text-bright ${ticket.component === 'No Component' ? 'text-red-400' : ''}`}>
              {ticket.component}
            </span>
            {ticket.component === 'No Component' && (
              <Badge value="Missing" severity="danger" className="text-xs" />
            )}
          </div>
        </div>

        {/* Story Points */}
        {ticket.storyPoints && (
          <div>
            <label className="block text-sm font-medium text-synth-text-muted mb-2">
              Story Points
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-synth-text-muted" />
              <span className="text-synth-text-bright">
                {ticket.storyPoints} points
              </span>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-synth-text-muted mb-2">
              Created
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-synth-text-muted" />
              <span className="text-synth-text-bright text-sm">
                {formatDate(ticket.created)}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-synth-text-muted mb-2">
              Last Updated
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-synth-text-muted" />
              <span className="text-synth-text-bright text-sm">
                {formatDate(ticket.updated)}
              </span>
            </div>
          </div>
        </div>

        {/* Crisis Indicators */}
        {(isOverdue || ticket.component === 'No Component' || ticket.status === 'Data Team New') && (
          <>
            <Divider />
            <div>
              <label className="block text-sm font-medium text-synth-text-muted mb-2">
                Crisis Indicators
              </label>
              <div className="space-y-2">
                {isOverdue && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Overdue by {daysOverdue} days</span>
                  </div>
                )}
                {ticket.component === 'No Component' && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Missing component assignment</span>
                  </div>
                )}
                {ticket.status === 'Data Team New' && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Stuck in Data Team New</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
