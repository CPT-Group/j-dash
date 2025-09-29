'use client';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AlertTriangle, Users, Clock, Database, Activity, ExternalLink } from 'lucide-react';
import { Ticket } from '@/types';

interface CrisisManagementDialogProps {
  visible: boolean;
  onHide: () => void;
  crisisData: {
    overdueTickets: Ticket[];
    missingComponentTickets: Ticket[];
    dataTeamNewTickets: Ticket[];
    workloadImbalance: { assignee: string; count: number }[];
  };
}

export default function CrisisManagementDialog({ 
  visible, 
  onHide, 
  crisisData 
}: CrisisManagementDialogProps) {
  const { overdueTickets, missingComponentTickets, dataTeamNewTickets, workloadImbalance } = crisisData;

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTicketAge = (created: string) => {
    const createdDate = new Date(created);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSeverityColor = (days: number) => {
    if (days >= 30) return 'red';
    if (days >= 14) return 'orange';
    if (days >= 7) return 'yellow';
    return 'green';
  };

  const overdueTemplate = (ticket: Ticket) => {
    const daysOverdue = ticket.dueDate ? getDaysOverdue(ticket.dueDate) : 0;
    return (
      <div className="flex items-center gap-2">
            <Badge 
              value={`${daysOverdue}d`} 
              severity={getSeverityColor(daysOverdue) as 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'}
              className="text-xs"
            />
        <span className="text-sm">{ticket.key}</span>
      </div>
    );
  };

  const ageTemplate = (ticket: Ticket) => {
    const age = getTicketAge(ticket.created);
    return (
      <div className="flex items-center gap-2">
        <Badge 
          value={`${age}d`} 
          severity={getSeverityColor(age) as 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'}
          className="text-xs"
        />
        <span className="text-sm">{ticket.key}</span>
      </div>
    );
  };

  const summaryTemplate = (ticket: Ticket) => (
    <div className="max-w-xs truncate text-sm" title={ticket.summary}>
      {ticket.summary}
    </div>
  );

  const assigneeTemplate = (ticket: Ticket) => (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-synth-text-muted" />
      <span className="text-sm">{ticket.assignee}</span>
    </div>
  );

  const actionTemplate = (ticket: Ticket) => (
    <Button
      icon={<ExternalLink className="w-4 h-4" />}
      className="p-button-outlined p-button-sm"
      onClick={() => window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank')}
    />
  );

  return (
    <Dialog
      header="🚨 Crisis Management Dashboard"
      visible={visible}
      onHide={onHide}
      style={{ width: '95vw', maxWidth: '1200px' }}
      modal
      className="crisis-management-dialog"
    >
      <div className="space-y-8">
        {/* Crisis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-400">Overdue Crisis</span>
            </div>
            <div className="text-2xl font-bold text-red-300">{overdueTickets.length}</div>
            <div className="text-sm text-red-400">Critical overdue tickets</div>
          </div>

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-orange-400">Components Crisis</span>
            </div>
            <div className="text-2xl font-bold text-orange-300">{missingComponentTickets.length}</div>
            <div className="text-sm text-orange-400">Missing components</div>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-purple-400">Data Team Bottleneck</span>
            </div>
            <div className="text-2xl font-bold text-purple-300">{dataTeamNewTickets.length}</div>
            <div className="text-sm text-purple-400">Stuck in Data Team New</div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-400">Workload Imbalance</span>
            </div>
            <div className="text-2xl font-bold text-yellow-300">
              {workloadImbalance.length > 0 ? Math.round(workloadImbalance[0].count / workloadImbalance[workloadImbalance.length - 1].count) : 0}:1
            </div>
            <div className="text-sm text-yellow-400">Workload ratio</div>
          </div>
        </div>

        <Divider />

        {/* Overdue Tickets Table */}
        <div>
          <h3 className="text-lg font-semibold text-synth-text-bright mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Critical Overdue Tickets ({overdueTickets.length})
          </h3>
          <DataTable
            value={overdueTickets.slice(0, 10)}
            paginator
            rows={5}
            className="crisis-table"
            emptyMessage="No overdue tickets"
          >
            <Column header="Ticket" body={overdueTemplate} />
            <Column header="Summary" body={summaryTemplate} />
            <Column header="Assignee" body={assigneeTemplate} />
            <Column header="Status" field="status" />
            <Column header="Action" body={actionTemplate} />
          </DataTable>
        </div>

        <Divider />

        {/* Missing Components Table */}
        <div>
          <h3 className="text-lg font-semibold text-synth-text-bright mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-400" />
            Missing Components ({missingComponentTickets.length})
          </h3>
          <DataTable
            value={missingComponentTickets.slice(0, 10)}
            paginator
            rows={5}
            className="crisis-table"
            emptyMessage="No missing component tickets"
          >
            <Column header="Ticket" field="key" />
            <Column header="Summary" body={summaryTemplate} />
            <Column header="Assignee" body={assigneeTemplate} />
            <Column header="Status" field="status" />
            <Column header="Action" body={actionTemplate} />
          </DataTable>
        </div>

        <Divider />

        {/* Data Team New Table */}
        <div>
          <h3 className="text-lg font-semibold text-synth-text-bright mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Data Team New Bottleneck ({dataTeamNewTickets.length})
          </h3>
          <DataTable
            value={dataTeamNewTickets.slice(0, 10)}
            paginator
            rows={5}
            className="crisis-table"
            emptyMessage="No Data Team New tickets"
          >
            <Column header="Ticket" body={ageTemplate} />
            <Column header="Summary" body={summaryTemplate} />
            <Column header="Assignee" body={assigneeTemplate} />
            <Column header="Age" body={(ticket) => `${getTicketAge(ticket.created)} days`} />
            <Column header="Action" body={actionTemplate} />
          </DataTable>
        </div>

        <Divider />

        {/* Workload Distribution */}
        <div>
          <h3 className="text-lg font-semibold text-synth-text-bright mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            Workload Distribution
          </h3>
          <div className="space-y-2">
            {workloadImbalance.map((item, index) => (
              <div key={item.assignee} className="flex items-center justify-between p-3 bg-synth-bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge 
                    value={index + 1} 
                    severity={index === 0 ? 'danger' : index < 3 ? 'warning' : 'info'}
                    className="text-xs"
                  />
                  <span className="text-synth-text-bright">{item.assignee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-synth-bg-primary rounded-full h-2">
                    <div 
                      className="bg-synth-neon-purple h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.count / workloadImbalance[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-synth-text-muted text-sm w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            label="Export Crisis Report"
            icon={<ExternalLink className="w-4 h-4" />}
            className="p-button-outlined"
            onClick={() => {
              // TODO: Implement export functionality
              console.log('Export crisis report');
            }}
          />
          <Button
            label="Close"
            className="p-button-secondary"
            onClick={onHide}
          />
        </div>
      </div>
    </Dialog>
  );
}
