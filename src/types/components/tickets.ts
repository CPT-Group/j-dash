// Ticket Component Types
export interface Ticket {
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

export interface OverdueTicket extends Ticket {
  daysOverdue: number;
}

export interface TicketCardProps {
  ticketKey: string;
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
  daysOverdue?: number;
}

export interface DataViewProps {
  tickets: Ticket[];
  title: string;
  viewType: 'grid' | 'list';
  showFilters?: boolean;
  className?: string;
}

export interface OverdueTicketsListProps {
  tickets: OverdueTicket[];
  maxDisplay?: number;
  showAll?: boolean;
}

export interface CaseCrisisAlertProps {
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
