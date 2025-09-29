'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useState, useRef } from 'react';
import { Ticket } from '@/types/components/tickets';

interface AdvancedDataTableProps {
  tickets: Ticket[];
  title?: string;
  className?: string;
  onTicketClick?: (ticket: Ticket) => void;
}

export default function AdvancedDataTable({ 
  tickets, 
  title = "Advanced Ticket Management",
  className = "",
  onTicketClick
}: AdvancedDataTableProps) {
  const [filters, setFilters] = useState({
    global: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
    key: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
    summary: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
    assignee: { value: null as string | null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null as string | null, matchMode: FilterMatchMode.EQUALS },
    priority: { value: null as string | null, matchMode: FilterMatchMode.EQUALS },
    component: { value: null as string | null, matchMode: FilterMatchMode.EQUALS },
    issueType: { value: null as string | null, matchMode: FilterMatchMode.EQUALS }
  });

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  // Get unique values for filters
  const assignees = [...new Set(tickets.map(t => t.assignee).filter(Boolean))];
  const statuses = [...new Set(tickets.map(t => t.status))];
  const priorities = [...new Set(tickets.map(t => t.priority).filter(Boolean))];
  const components = [...new Set(tickets.map(t => t.component).filter(Boolean))];
  const issueTypes = [...new Set(tickets.map(t => t.issueType))];

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      key: { value: null, matchMode: FilterMatchMode.CONTAINS },
      summary: { value: null, matchMode: FilterMatchMode.CONTAINS },
      assignee: { value: null, matchMode: FilterMatchMode.EQUALS },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      priority: { value: null, matchMode: FilterMatchMode.EQUALS },
      component: { value: null, matchMode: FilterMatchMode.EQUALS },
      issueType: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    setGlobalFilterValue('');
  };

  const getPrioritySeverity = (priority: string) => {
    switch (priority?.toLowerCase()) {
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

  const keyTemplate = (ticket: Ticket) => {
    return (
      <div className="flex items-center space-x-2">
        <span className="font-mono text-sm font-semibold text-synth-text-bright">
          {ticket.key}
        </span>
        {isOverdue(ticket) && (
          <Badge value="Overdue" severity="danger" />
        )}
      </div>
    );
  };

  const summaryTemplate = (ticket: Ticket) => {
    return (
      <div className="max-w-xs">
        <p className="text-sm text-synth-text-bright line-clamp-2">
          {ticket.summary}
        </p>
      </div>
    );
  };

  const assigneeTemplate = (ticket: Ticket) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-synth-bg-hover rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-synth-text-bright">
            {ticket.assignee ? ticket.assignee.split(' ').map(n => n[0]).join('') : '??'}
          </span>
        </div>
        <span className="text-sm text-synth-text-bright">
          {ticket.assignee || 'Unassigned'}
        </span>
      </div>
    );
  };

  const statusTemplate = (ticket: Ticket) => {
    return (
      <Tag 
        value={ticket.status} 
        severity={getStatusSeverity(ticket.status)}
      />
    );
  };

  const priorityTemplate = (ticket: Ticket) => {
    return (
      <Tag 
        value={ticket.priority || 'Unassigned'} 
        severity={getPrioritySeverity(ticket.priority || 'Unassigned')}
      />
    );
  };

  const componentTemplate = (ticket: Ticket) => {
    return (
      <Tag 
        value={ticket.component || 'No Component'} 
        severity={ticket.component ? 'info' : 'danger'}
      />
    );
  };

  const issueTypeTemplate = (ticket: Ticket) => {
    return (
      <Tag 
        value={ticket.issueType} 
        severity="info"
      />
    );
  };

  const dueDateTemplate = (ticket: Ticket) => {
    if (!ticket.dueDate) {
      return <span className="text-synth-text-muted text-sm">No due date</span>;
    }
    
    const isOverdueTicket = isOverdue(ticket);
    return (
      <span className={`text-sm ${isOverdueTicket ? 'text-red-500 font-semibold' : 'text-synth-text-bright'}`}>
        {formatDate(ticket.dueDate)}
      </span>
    );
  };

  const createdTemplate = (ticket: Ticket) => {
    return (
      <span className="text-sm text-synth-text-muted">
        {formatDate(ticket.created)}
      </span>
    );
  };

  const actionTemplate = (ticket: Ticket) => {
    return (
      <div className="flex space-x-1">
        <Button
          icon="pi pi-eye"
          severity="secondary"
          text
          onClick={() => onTicketClick?.(ticket)}
          tooltip="View Details"
        />
        <Button
          icon="pi pi-external-link"
          severity="secondary"
          text
          onClick={() => window.open(`https://cptgroup.atlassian.net/browse/${ticket.key}`, '_blank')}
          tooltip="Open in Jira"
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-col lg:flex-row gap-4 mb-4">
      <div className="flex-1">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search all fields..."
            className="w-full"
          />
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />
        <Button
          type="button"
          icon="pi pi-download"
          label="Export"
          outlined
          onClick={() => {
            // Export functionality would go here
            console.log('Export selected tickets:', selectedTickets);
          }}
        />
      </div>
    </div>
  );

  return (
    <Card title={title} className={className}>
      <DataTable
        value={tickets}
        paginator
        rows={25}
        rowsPerPageOptions={[10, 25, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
        loading={loading}
        header={header}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        globalFilterFields={['key', 'summary', 'assignee', 'status', 'priority', 'component', 'issueType']}
        selection={selectedTickets}
        onSelectionChange={(e) => setSelectedTickets(e.value)}
        selectionMode="multiple"
        metaKeySelection={false}
        sortField="created"
        sortOrder={-1}
        removableSort
        resizableColumns
        columnResizeMode="expand"
        scrollable
        scrollHeight="600px"
        virtualScrollerOptions={{ 
          itemSize: 50,
          showLoader: true,
          loading: loading,
          onLazyLoad: () => {
            setLoading(true);
            // Simulate loading delay
            setTimeout(() => setLoading(false), 1000);
          }
        }}
        emptyMessage="No tickets found"
        className="w-full"
        pt={{
          table: { className: 'w-full' },
          header: { className: 'bg-synth-bg-card' },
          paginator: { className: 'bg-synth-bg-card border-t border-synth-border-primary' }
        }}
      >
        <Column 
          selectionMode="multiple" 
          headerStyle={{ width: '3rem' }}
          frozen
        />
        <Column 
          field="key" 
          header="Key" 
          sortable 
          filter 
          filterPlaceholder="Search by key"
          body={keyTemplate}
          style={{ minWidth: '120px' }}
        />
        <Column 
          field="summary" 
          header="Summary" 
          sortable 
          filter 
          filterPlaceholder="Search summary"
          body={summaryTemplate}
          style={{ minWidth: '200px' }}
        />
        <Column 
          field="assignee" 
          header="Assignee" 
          sortable 
          filter 
          filterElement={
            <Dropdown
              value={filters.assignee.value}
              options={assignees}
              onChange={(e) => {
                const _filters = { ...filters };
                _filters['assignee'].value = e.value;
                setFilters(_filters);
              }}
              placeholder="Select assignee"
              className="p-column-filter"
              showClear
            />
          }
          body={assigneeTemplate}
          style={{ minWidth: '150px' }}
        />
        <Column 
          field="status" 
          header="Status" 
          sortable 
          filter 
          filterElement={
            <Dropdown
              value={filters.status.value}
              options={statuses}
              onChange={(e) => {
                const _filters = { ...filters };
                _filters['status'].value = e.value;
                setFilters(_filters);
              }}
              placeholder="Select status"
              className="p-column-filter"
              showClear
            />
          }
          body={statusTemplate}
          style={{ minWidth: '120px' }}
        />
        <Column 
          field="priority" 
          header="Priority" 
          sortable 
          filter 
          filterElement={
            <Dropdown
              value={filters.priority.value}
              options={priorities}
              onChange={(e) => {
                const _filters = { ...filters };
                _filters['priority'].value = e.value;
                setFilters(_filters);
              }}
              placeholder="Select priority"
              className="p-column-filter"
              showClear
            />
          }
          body={priorityTemplate}
          style={{ minWidth: '100px' }}
        />
        <Column 
          field="component" 
          header="Component" 
          sortable 
          filter 
          filterElement={
            <Dropdown
              value={filters.component.value}
              options={components}
              onChange={(e) => {
                const _filters = { ...filters };
                _filters['component'].value = e.value;
                setFilters(_filters);
              }}
              placeholder="Select component"
              className="p-column-filter"
              showClear
            />
          }
          body={componentTemplate}
          style={{ minWidth: '120px' }}
        />
        <Column 
          field="issueType" 
          header="Type" 
          sortable 
          filter 
          filterElement={
            <Dropdown
              value={filters.issueType.value}
              options={issueTypes}
              onChange={(e) => {
                const _filters = { ...filters };
                _filters['issueType'].value = e.value;
                setFilters(_filters);
              }}
              placeholder="Select type"
              className="p-column-filter"
              showClear
            />
          }
          body={issueTypeTemplate}
          style={{ minWidth: '100px' }}
        />
        <Column 
          field="dueDate" 
          header="Due Date" 
          sortable 
          body={dueDateTemplate}
          style={{ minWidth: '100px' }}
        />
        <Column 
          field="created" 
          header="Created" 
          sortable 
          body={createdTemplate}
          style={{ minWidth: '100px' }}
        />
        <Column 
          header="Actions" 
          body={actionTemplate}
          style={{ minWidth: '100px' }}
          frozen
          alignFrozen="right"
        />
      </DataTable>
    </Card>
  );
}
