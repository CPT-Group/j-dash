import { JiraIssueResponse, Ticket, OverdueTicket } from '@/types';

export function transformJiraIssueToTicket(issue: JiraIssueResponse): Ticket {
  return {
    key: issue.key,
    summary: issue.fields.summary,
    assignee: issue.fields.assignee?.displayName || 'Unassigned',
    status: issue.fields.status.name,
    priority: issue.fields.priority?.name || 'None',
    dueDate: issue.fields.duedate || undefined,
    component: issue.fields.components?.[0]?.name || undefined,
    issueType: issue.fields.issuetype.name,
    created: issue.fields.created,
    updated: issue.fields.updated,
    storyPoints: issue.fields.customfield_10016 || undefined,
  };
}

export function transformJiraIssuesToTickets(issues: JiraIssueResponse[]): Ticket[] {
  return issues.map(transformJiraIssueToTicket);
}

export function transformJiraIssueToOverdueTicket(issue: JiraIssueResponse): OverdueTicket {
  const ticket = transformJiraIssueToTicket(issue);
  const dueDate = issue.fields.duedate;
  const daysOverdue = dueDate ? Math.max(0, Math.ceil((Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
  
  return {
    ...ticket,
    daysOverdue,
  };
}

export function transformJiraIssuesToOverdueTickets(issues: JiraIssueResponse[]): OverdueTicket[] {
  return issues.map(transformJiraIssueToOverdueTicket);
}
