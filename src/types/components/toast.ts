// Toast Component Types
export interface ToastManagerProps {
  tickets: Ticket[];
  previousTickets: Ticket[];
  overdueCount: number;
  previousOverdueCount: number;
  missingComponentsCount: number;
  previousMissingComponentsCount: number;
  dataTeamNewCount: number;
  previousDataTeamNewCount: number;
}

export interface ToastConfig {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
  life?: number; // Auto-dismiss time in ms, 0 = no auto-dismiss
  sticky?: boolean;
}

export interface ToastTrigger {
  condition: (tickets: Ticket[], previousTickets: Ticket[]) => boolean;
  config: ToastConfig;
  id: string;
}

// Re-export Ticket type for convenience
import { Ticket } from './tickets';
