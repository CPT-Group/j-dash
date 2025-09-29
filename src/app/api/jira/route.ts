import { NextRequest, NextResponse } from 'next/server';

// Temporarily hardcode credentials for testing
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL || 'kyle@cptgroup.com';
const JIRA_DOMAIN = process.env.JIRA_BASE_URL || 'https://cptgroup.atlassian.net';

console.log('Using credentials:');
console.log('JIRA_API_TOKEN:', JIRA_API_TOKEN ? 'SET' : 'NOT SET');
console.log('JIRA_USER_EMAIL:', JIRA_USER_EMAIL);
console.log('JIRA_DOMAIN:', JIRA_DOMAIN);

async function makeJiraRequest(path: string) {
  if (!JIRA_API_TOKEN || !JIRA_USER_EMAIL || !JIRA_DOMAIN) {
    throw new Error('Jira API credentials are not set in environment variables.');
  }

  const auth = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  
  const url = `${JIRA_DOMAIN}/rest/api/3${path}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Jira API error details:', errorText);
    throw new Error(`Jira API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// Cache for API responses
const cache = new Map<string, { data: Record<string, unknown>; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds (5 minutes for most data, 1 minute for critical data)
const CACHE_TTL = {
  CRITICAL: 60 * 1000, // 1 minute for overdue, missing components, data team new
  NORMAL: 5 * 60 * 1000, // 5 minutes for general data
  ALL_TICKETS: 2 * 60 * 1000 // 2 minutes for all tickets (more frequent updates)
};

function getCacheKey(endpoint: string, jql: string): string {
  return `${endpoint}:${jql}`;
}

function getCacheTTL(jql: string): number {
  if (jql.includes('duedate < now()') || jql.includes('component is EMPTY') || jql.includes('Data Team New')) {
    return CACHE_TTL.CRITICAL;
  }
  if (jql.includes('ORDER BY updated DESC') && !jql.includes('status =')) {
    return CACHE_TTL.ALL_TICKETS;
  }
  return CACHE_TTL.NORMAL;
}

function isCacheValid(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl;
}

async function fetchAllJiraData(jql: string, fields: string): Promise<Record<string, unknown>> {
  const allIssues: Record<string, unknown>[] = [];
  let startAt = 0;
  const maxResults = 1000; // Jira's maximum per request
  let total = 0;
  let hasMore = true;

  console.log(`Fetching all data for JQL: ${jql}`);

  while (hasMore) {
    const url = `/search/jql?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}&fields=${fields}`;
    console.log(`Fetching batch: startAt=${startAt}, maxResults=${maxResults}`);
    
    const batchData = await makeJiraRequest(url) as Record<string, unknown>;
    
    if (batchData.issues && Array.isArray(batchData.issues) && batchData.issues.length > 0) {
      allIssues.push(...(batchData.issues as Record<string, unknown>[]));
      total = (batchData.total as number) || allIssues.length;
      startAt += maxResults;
      hasMore = allIssues.length < total;
      
      console.log(`Fetched ${(batchData.issues as Record<string, unknown>[]).length} issues, total so far: ${allIssues.length}/${total}`);
    } else {
      hasMore = false;
    }

    // Safety check to prevent infinite loops
    if (startAt > 50000) { // Max 50k tickets
      console.warn('Reached safety limit of 50k tickets, stopping pagination');
      break;
    }
  }

  console.log(`Completed fetching all data: ${allIssues.length} total issues`);
  
  return {
    total: allIssues.length,
    issues: allIssues
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const jql = searchParams.get('jql');
    const useCache = searchParams.get('cache') !== 'false'; // Default to true

    console.log('API Request:', { endpoint, jql, useCache });

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

    // Check cache first
    if (useCache) {
      const cacheKey = getCacheKey(endpoint, jql);
      const cached = cache.get(cacheKey);
      
      if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
        console.log('Returning cached data for:', cacheKey);
        return NextResponse.json(cached.data);
      }
    }

    console.log('Making Jira request with JQL:', jql);
    
    // Fetch all data with pagination
    const fields = 'summary,assignee,status,priority,duedate,components,issuetype,created,updated,customfield_10016';
    const data = await fetchAllJiraData(jql, fields);
    
    console.log('Jira response received, total issues:', data.total);
    
    // Cache the result
    if (useCache) {
      const cacheKey = getCacheKey(endpoint, jql);
      const ttl = getCacheTTL(jql);
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl
      });
      
      // Clean up old cache entries
      for (const [key, value] of cache.entries()) {
        if (!isCacheValid(value.timestamp, value.ttl)) {
          cache.delete(key);
        }
      }
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Jira data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}