// Jira Hook Types
import { JiraSearchResponse } from '../api/jira';

export interface UseJiraDataReturn {
  data: JiraSearchResponse | null;
  loading: boolean;
  error: string | null;
  refetch?: () => Promise<void>;
}

export interface UseJiraDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: JiraSearchResponse) => void;
  onError?: (error: string) => void;
}

export interface JiraQueryParams {
  jql: string;
  maxResults?: number;
  startAt?: number;
  fields?: string[];
}

export interface JiraDataState {
  overdueTickets: JiraSearchResponse | null;
  dueTodayTickets: JiraSearchResponse | null;
  missingComponentTickets: JiraSearchResponse | null;
  dataTeamNewTickets: JiraSearchResponse | null;
  allTickets: JiraSearchResponse | null;
  loading: {
    overdue: boolean;
    dueToday: boolean;
    missingComponents: boolean;
    dataTeamNew: boolean;
    allTickets: boolean;
  };
  errors: {
    overdue: string | null;
    dueToday: string | null;
    missingComponents: string | null;
    dataTeamNew: string | null;
    allTickets: string | null;
  };
}
