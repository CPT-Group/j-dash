import { NextRequest, NextResponse } from 'next/server';

// Temporarily hardcode credentials for testing
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL || 'kyle@cptgroup.com';
const JIRA_DOMAIN = process.env.JIRA_BASE_URL || 'https://cptgroup.atlassian.net';

console.log('Using credentials:');
console.log('JIRA_API_TOKEN:', JIRA_API_TOKEN ? 'SET' : 'NOT SET');
console.log('JIRA_USER_EMAIL:', JIRA_USER_EMAIL);
console.log('JIRA_DOMAIN:', JIRA_DOMAIN);

async function makeJiraRequest(path: string, params: Record<string, string> = {}) {
  if (!JIRA_API_TOKEN || !JIRA_USER_EMAIL || !JIRA_DOMAIN) {
    throw new Error('Jira API credentials are not set in environment variables.');
  }

  const auth = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  
  const url = new URL(`${JIRA_DOMAIN}/rest/api/3/search/jql`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const jql = searchParams.get('jql');

    console.log('API Request:', { endpoint, jql });

    if (!endpoint || !jql) {
      return NextResponse.json(
        { error: 'Missing endpoint or jql parameter' },
        { status: 400 }
      );
    }

    if (endpoint !== 'search') {
      return NextResponse.json(
        { error: 'Only search endpoint is supported' },
        { status: 400 }
      );
    }

    console.log('Making Jira request with JQL:', jql);
    const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(jql)}`);
    console.log('Jira response received, total issues:', data.total);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Jira data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}