// Jira API Response Types
export interface JiraProjectResponse {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  description?: string;
  lead?: {
    displayName: string;
    emailAddress: string;
  };
  avatarUrls?: {
    '16x16': string;
    '24x24': string;
    '32x32': string;
    '48x48': string;
  };
}

export interface JiraIssueResponse {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      id: string;
      name: string;
      statusCategory: {
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
    assignee?: {
      accountId: string;
      displayName: string;
      emailAddress: string;
      avatarUrls: {
        '16x16': string;
        '24x24': string;
        '32x32': string;
        '48x48': string;
      };
    };
    priority?: {
      id: string;
      name: string;
      iconUrl: string;
    };
    issuetype: {
      id: string;
      name: string;
      iconUrl: string;
      subtask: boolean;
    };
    created: string;
    updated: string;
    duedate?: string;
    components: Array<{
      id: string;
      name: string;
      description?: string;
    }>;
    customfield_10016?: number; // Story points field
    customfield_10020?: Array<{
      id: number;
      name: string;
      state: string;
      startDate: string;
      endDate: string;
    }>; // Sprint field
    project: {
      id: string;
      key: string;
      name: string;
    };
  };
}

export interface JiraSprintResponse {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
  originBoardId: number;
  goal?: string;
}

export interface JiraSearchResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssueResponse[];
}

export interface JiraErrorResponse {
  errorMessages: string[];
  errors: Record<string, string>;
}

// Jira API Request Types
export interface JiraSearchParams {
  jql: string;
  startAt?: number;
  maxResults?: number;
  fields?: string[];
  expand?: string[];
}

export interface JiraCreateIssueParams {
  fields: {
    project: { key: string };
    summary: string;
    description?: string;
    issuetype: { name: string };
    assignee?: { name: string };
    priority?: { name: string };
    components?: Array<{ name: string }>;
    duedate?: string;
    customfield_10016?: number; // Story points
  };
}

export interface JiraUpdateIssueParams {
  fields: {
    summary?: string;
    description?: string;
    assignee?: { name: string } | null;
    priority?: { name: string };
    status?: { name: string };
    duedate?: string;
    customfield_10016?: number;
  };
}
