import { NextRequest, NextResponse } from 'next/server';

const JIRA_DOMAIN = 'cptgroup.atlassian.net';
const JIRA_EMAIL = 'kyle@cptgroup.com';
const JIRA_TOKEN = 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';

async function makeJiraRequest(path: string, params: Record<string, string> = {}) {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
  
  const url = new URL(`https://${JIRA_DOMAIN}/rest/api/3${path}`);
  
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

    const data = await makeJiraRequest('/search', { jql });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Jira data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}