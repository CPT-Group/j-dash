import { 
  JiraProjectResponse, 
  JiraIssueResponse, 
  JiraSprintResponse, 
  JiraSearchResponse,
  JiraSearchParams,
  JiraCreateIssueParams,
  JiraUpdateIssueParams
} from '@/types/api/jira';

// Internal domain models
export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  assignee?: string;
  priority: string;
  issueType: string;
  created: string;
  updated: string;
  storyPoints?: number;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
}

export class JiraAPI {
  private baseUrl: string;
  private token: string;
  private email: string;

  constructor(token: string, email: string, baseUrl: string) {
    this.token = token;
    this.email = email;
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/rest/api/3${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${btoa(`${this.email}:${this.token}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProjects(): Promise<JiraProject[]> {
    const data = await this.makeRequest<JiraProjectResponse[]>('/project');
    return data.map((project) => ({
      id: project.id,
      key: project.key,
      name: project.name,
      projectTypeKey: project.projectTypeKey,
    }));
  }

  async getIssues(projectKey: string, jql: string = ''): Promise<JiraIssue[]> {
    const jqlQuery = jql || `project = ${projectKey} ORDER BY updated DESC`;
    
    const data = await this.makeRequest<JiraSearchResponse>(`/search?jql=${encodeURIComponent(jqlQuery)}&maxResults=100`);
    
    return (data?.issues || []).map((issue) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name || 'None',
      issueType: issue.fields.issuetype.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
      storyPoints: issue.fields.customfield_10016,
    }));
  }

  async getSprints(projectKey: string): Promise<JiraSprint[]> {
    try {
      const data = await this.makeRequest<{ values: JiraSprintResponse[] }>(`/sprint/search?query=${projectKey}`);
      return data.values.map((sprint) => ({
        id: sprint.id,
        name: sprint.name,
        state: sprint.state,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        completeDate: sprint.completeDate,
      }));
    } catch (error) {
      console.warn('Failed to fetch sprints:', error);
      return [];
    }
  }

  async getActiveSprint(projectKey: string): Promise<JiraSprint | null> {
    const sprints = await this.getSprints(projectKey);
    const now = new Date();
    
    return sprints.find(sprint => {
      const startDate = new Date(sprint.startDate);
      const endDate = new Date(sprint.endDate);
      return sprint.state === 'ACTIVE' && now >= startDate && now <= endDate;
    }) || null;
  }

  async getSprintIssues(sprintId: number): Promise<JiraIssue[]> {
    const data = await this.makeRequest<JiraSearchResponse>(`/sprint/${sprintId}/issue?maxResults=100`);
    
    return (data?.issues || []).map((issue) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name || 'None',
      issueType: issue.fields.issuetype.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
      storyPoints: issue.fields.customfield_10016,
    }));
  }

  // Analytics helper methods
  async getSprintBurndownData(sprintId: number): Promise<{ date: string; completed: number; remaining: number }[]> {
    // This would typically require additional Jira add-ons or custom implementation
    // For now, return mock data structure
    return [
      { date: '2024-01-01', completed: 0, remaining: 40 },
      { date: '2024-01-02', completed: 5, remaining: 35 },
      { date: '2024-01-03', completed: 12, remaining: 28 },
      { date: '2024-01-04', completed: 18, remaining: 22 },
      { date: '2024-01-05', completed: 25, remaining: 15 },
      { date: '2024-01-06', completed: 32, remaining: 8 },
      { date: '2024-01-07', completed: 40, remaining: 0 },
    ];
  }

  async getVelocityData(projectKey: string, sprintsCount: number = 6): Promise<{ sprint: string; velocity: number }[]> {
    const sprints = await this.getSprints(projectKey);
    const recentSprints = (sprints || []).slice(-sprintsCount);
    
    const velocityData: { sprint: string; velocity: number }[] = [];
    for (const sprint of recentSprints) {
      const issues = await this.getSprintIssues(sprint.id);
      const completedPoints = issues
        .filter(issue => issue.status === 'Done')
        .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
      
      velocityData.push({
        sprint: sprint.name,
        velocity: completedPoints,
      });
    }
    
    return velocityData;
  }

  async getTeamPerformance(projectKey: string): Promise<{ assignee: string; totalIssues: number; completedIssues: number; completionRate: number }[]> {
    const issues = await this.getIssues(projectKey);
    const assigneeStats = new Map<string, { total: number; completed: number }>();
    
    issues.forEach(issue => {
      if (issue.assignee) {
        const stats = assigneeStats.get(issue.assignee) || { total: 0, completed: 0 };
        stats.total++;
        if (issue.status === 'Done') {
          stats.completed++;
        }
        assigneeStats.set(issue.assignee, stats);
      }
    });

    return Array.from(assigneeStats.entries()).map(([assignee, stats]) => ({
      assignee,
      totalIssues: stats.total,
      completedIssues: stats.completed,
      completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    }));
  }

  // CRUD operations
  async createIssue(params: JiraCreateIssueParams): Promise<JiraIssue> {
    const response = await this.makeRequest<JiraIssueResponse>('/issue', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    return {
      id: response.id,
      key: response.key,
      summary: response.fields.summary,
      status: response.fields.status.name,
      assignee: response.fields.assignee?.displayName,
      priority: response.fields.priority?.name || 'None',
      issueType: response.fields.issuetype.name,
      created: response.fields.created,
      updated: response.fields.updated,
      storyPoints: response.fields.customfield_10016,
    };
  }

  async updateIssue(issueKey: string, params: JiraUpdateIssueParams): Promise<void> {
    await this.makeRequest(`/issue/${issueKey}`, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
  }

  async deleteIssue(issueKey: string): Promise<void> {
    await this.makeRequest(`/issue/${issueKey}`, {
      method: 'DELETE',
    });
  }
}