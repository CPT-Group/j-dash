'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { JiraSearchResponse, UseJiraDataReturn } from '@/types';

// Global cache for client-side memoization
const clientCache = new Map<string, { data: JiraSearchResponse; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds
const CACHE_TTL = {
  CRITICAL: 30 * 1000, // 30 seconds for critical data (overdue, missing components)
  NORMAL: 2 * 60 * 1000, // 2 minutes for normal data
  ALL_TICKETS: 1 * 60 * 1000 // 1 minute for all tickets
};

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

function getCacheKey(jql: string): string {
  return `jira:${jql}`;
}

async function fetchJiraData(jql: string, useCache: boolean = true): Promise<JiraSearchResponse> {
  const cacheKey = getCacheKey(jql);
  
  // Check client-side cache first
  if (useCache) {
    const cached = clientCache.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
      console.log('Using cached data for:', jql.substring(0, 50) + '...');
      return cached.data;
    }
  }

  console.log('Fetching fresh data for:', jql.substring(0, 50) + '...');
  
  const response = await fetch(`/api/jira?endpoint=search&jql=${encodeURIComponent(jql)}&cache=${useCache}`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the result
  if (useCache) {
    const ttl = getCacheTTL(jql);
    clientCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    // Clean up old cache entries
    for (const [key, value] of clientCache.entries()) {
      if (!isCacheValid(value.timestamp, value.ttl)) {
        clientCache.delete(key);
      }
    }
  }
  
  return data;
}

// Memoized JQL queries
const JQL_QUERIES = {
  OVERDUE: `project in (CM,OPRD) AND status in ("Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA") AND duedate < now() ORDER BY duedate ASC`,
  
  DUE_TODAY: `project in (CM,OPRD) AND status in ("Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA") AND duedate = "2025-01-29" ORDER BY priority DESC`,
  
  MISSING_COMPONENTS: `project in (CM,OPRD) AND status in ("Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA") AND component is EMPTY ORDER BY updated DESC`,
  
  DATA_TEAM_NEW: `project in (CM,OPRD) AND status in ("Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA") AND status = "Data Team New" ORDER BY updated DESC`,
  
  ALL_TICKETS: `project in (CM,OPRD) AND status in ("Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA") ORDER BY updated DESC`
};

// Enhanced hook with memoization and caching
export function useOverdueTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchJiraData(JQL_QUERIES.OVERDUE, true);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDueTodayTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchJiraData(JQL_QUERIES.DUE_TODAY, true);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useMissingComponentTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchJiraData(JQL_QUERIES.MISSING_COMPONENTS, true);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDataTeamNewTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchJiraData(JQL_QUERIES.DATA_TEAM_NEW, true);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAllTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchJiraData(JQL_QUERIES.ALL_TICKETS, true);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Memoized statistics hook
export function useJiraStats() {
  const overdueData = useOverdueTickets();
  const dueTodayData = useDueTodayTickets();
  const missingComponentData = useMissingComponentTickets();
  const dataTeamNewData = useDataTeamNewTickets();
  const allTicketsData = useAllTickets();

  const stats = useMemo(() => {
    const isLoading = overdueData.loading || dueTodayData.loading || missingComponentData.loading || 
                     dataTeamNewData.loading || allTicketsData.loading;
    
    const hasError = overdueData.error || dueTodayData.error || missingComponentData.error || 
                    dataTeamNewData.error || allTicketsData.error;

    return {
      overdueCount: overdueData.data?.total || 0,
      dueTodayCount: dueTodayData.data?.total || 0,
      missingComponentsCount: missingComponentData.data?.total || 0,
      dataTeamNewCount: dataTeamNewData.data?.total || 0,
      totalTickets: allTicketsData.data?.total || 0,
      teamPerformance: {
        kyle: allTicketsData.data?.issues?.filter(t => t.fields.assignee?.displayName === 'Kyle Dilbeck').length || 0,
        james: allTicketsData.data?.issues?.filter(t => t.fields.assignee?.displayName === 'James Cassidy').length || 0,
        thomas: allTicketsData.data?.issues?.filter(t => t.fields.assignee?.displayName === 'Thomas Williams').length || 0
      },
      isLoading,
      hasError,
      errors: {
        overdue: overdueData.error,
        dueToday: dueTodayData.error,
        missingComponents: missingComponentData.error,
        dataTeamNew: dataTeamNewData.error,
        allTickets: allTicketsData.error
      }
    };
  }, [overdueData, dueTodayData, missingComponentData, dataTeamNewData, allTicketsData]);

  const refetchAll = useCallback(async () => {
    await Promise.all([
      overdueData.refetch?.(),
      dueTodayData.refetch?.(),
      missingComponentData.refetch?.(),
      dataTeamNewData.refetch?.(),
      allTicketsData.refetch?.()
    ]);
  }, [overdueData, dueTodayData, missingComponentData, dataTeamNewData, allTicketsData]);

  return { ...stats, refetchAll };
}

// Clear cache function for manual cache invalidation
export function clearJiraCache() {
  clientCache.clear();
  console.log('Jira cache cleared');
}

// Get cache statistics
export function getCacheStats() {
  const now = Date.now();
  const entries = Array.from(clientCache.entries()).map(([key, value]) => ({
    key: key.substring(0, 50) + '...',
    age: now - value.timestamp,
    ttl: value.ttl,
    isValid: isCacheValid(value.timestamp, value.ttl)
  }));
  
  return {
    totalEntries: clientCache.size,
    validEntries: entries.filter(e => e.isValid).length,
    expiredEntries: entries.filter(e => !e.isValid).length,
    entries
  };
}
