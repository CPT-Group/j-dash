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

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
}

export class JiraAPI {
  private baseUrl: string;
  private token: string;
  private email: string;

  constructor(token: string, email: string, baseUrl: string) {
    this.token = token;
    this.email = email;
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/rest/api/3${endpoint}`;
    
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
    const data = await this.makeRequest('/project');
    return data.map((project: any) => ({
      id: project.id,
      key: project.key,
      name: project.name,
      projectTypeKey: project.projectTypeKey,
    }));
  }

  async getIssues(projectKey: string, jql: string = ''): Promise<JiraIssue[]> {
    const jqlQuery = jql || `project = ${projectKey} ORDER BY updated DESC`;
    
    const data = await this.makeRequest(`/search?jql=${encodeURIComponent(jqlQuery)}&maxResults=100`);
    
    return data.issues.map((issue: any) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name || 'None',
      issueType: issue.fields.issuetype.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
      storyPoints: issue.fields.customfield_10016, // Common story points field
    }));
  }

  async getSprints(projectKey: string): Promise<JiraSprint[]> {
    try {
      const data = await this.makeRequest(`/sprint/search?query=${projectKey}`);
      return data.values.map((sprint: any) => ({
        id: sprint.id,
        name: sprint.name,
        state: sprint.state,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        completeDate: sprint.completeDate,
      }));
    } catch (error) {
      console.warn('Sprint data not available:', error);
      return [];
    }
  }

  async getCurrentSprint(projectKey: string): Promise<JiraSprint | null> {
    const sprints = await this.getSprints(projectKey);
    const now = new Date();
    
    return sprints.find(sprint => {
      const startDate = new Date(sprint.startDate);
      const endDate = new Date(sprint.endDate);
      return sprint.state === 'ACTIVE' && now >= startDate && now <= endDate;
    }) || null;
  }

  async getSprintIssues(sprintId: number): Promise<JiraIssue[]> {
    const data = await this.makeRequest(`/sprint/${sprintId}/issue?maxResults=100`);
    
    return data.issues.map((issue: any) => ({
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

  async getIssueTransitions(issueKey: string) {
    const data = await this.makeRequest(`/issue/${issueKey}/transitions`);
    return data.transitions;
  }

  async transitionIssue(issueKey: string, transitionId: string) {
    return this.makeRequest(`/issue/${issueKey}/transitions`, {
      method: 'POST',
      body: JSON.stringify({
        transition: { id: transitionId }
      }),
    });
  }

  // Analytics helper methods
  async getSprintBurndownData(sprintId: number): Promise<any[]> {
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

  async getVelocityData(projectKey: string, sprintsCount: number = 6): Promise<any[]> {
    const sprints = await this.getSprints(projectKey);
    const recentSprints = sprints.slice(-sprintsCount);
    
    const velocityData = [];
    for (const sprint of recentSprints) {
      const issues = await this.getSprintIssues(sprint.id);
      const completedPoints = issues
        .filter(issue => issue.status === 'Done')
        .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
      
      velocityData.push({
        sprint: sprint.name,
        points: completedPoints,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
      });
    }
    
    return velocityData;
  }

  async getTeamPerformance(projectKey: string): Promise<any[]> {
    const issues = await this.getIssues(projectKey);
    const assigneeStats = new Map();
    
    issues.forEach(issue => {
      if (issue.assignee) {
        if (!assigneeStats.has(issue.assignee)) {
          assigneeStats.set(issue.assignee, {
            name: issue.assignee,
            completed: 0,
            inProgress: 0,
            total: 0,
          });
        }
        
        const stats = assigneeStats.get(issue.assignee);
        stats.total++;
        
        if (issue.status === 'Done') {
          stats.completed++;
        } else if (issue.status === 'In Progress') {
          stats.inProgress++;
        }
      }
    });
    
    return Array.from(assigneeStats.values()).map(stats => ({
      ...stats,
      efficiency: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));
  }
}

// Utility function to parse Jira token and extract email
export function parseJiraToken(token: string): { email: string; baseUrl: string } | null {
  // This is a simplified parser - in a real app, you'd want more robust validation
  // The token format is typically: ATATT3xFfGF0...@domain.com
  const emailMatch = token.match(/@([^=]+)/);
  if (!emailMatch) {
    throw new Error('Invalid Jira token format. Please ensure you have a valid API token.');
  }
  
  // Extract domain and construct base URL
  const domain = emailMatch[1];
  const baseUrl = `https://${domain}.atlassian.net`;
  
  // Extract email from token (this is a simplified approach)
  // In practice, you might need to ask the user for their email separately
  const email = `user@${domain}`; // This would need to be provided by the user
  
  return { email, baseUrl };
}
