import { NextRequest, NextResponse } from 'next/server';
import { JiraAPI } from '@/lib/jira-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const jql = searchParams.get('jql');

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
    }

    const jiraToken = process.env.JIRA_API_TOKEN;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraBaseUrl = process.env.JIRA_BASE_URL;

    if (!jiraToken || !jiraEmail || !jiraBaseUrl) {
      return NextResponse.json({ error: 'Jira configuration missing' }, { status: 500 });
    }

    const jiraAPI = new JiraAPI(jiraToken, jiraEmail, jiraBaseUrl);

    let data;
    switch (endpoint) {
      case 'search':
        if (!jql) {
          return NextResponse.json({ error: 'Missing jql parameter for search' }, { status: 400 });
        }
        data = await jiraAPI.makeRequest(`/search?jql=${encodeURIComponent(jql)}&maxResults=100`);
        break;
      case 'projects':
        data = await jiraAPI.getProjects();
        break;
      case 'sprints':
        const projectKey = searchParams.get('projectKey');
        if (!projectKey) {
          return NextResponse.json({ error: 'Missing projectKey parameter for sprints' }, { status: 400 });
        }
        data = await jiraAPI.getSprints(projectKey);
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Jira' },
      { status: 500 }
    );
  }
}
