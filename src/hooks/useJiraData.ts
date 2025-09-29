'use client';

import { useState, useEffect } from 'react';
import { JiraSearchResponse, UseJiraDataReturn } from '@/types';

export function useOverdueTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jira?endpoint=search&jql=project%20in%20(CM,OPRD)%20AND%20duedate%20%3C%20now()%20AND%20status%20!%3D%20Done%20ORDER%20BY%20duedate%20ASC');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useDueTodayTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/jira?endpoint=search&jql=project%20in%20(CM,OPRD)%20AND%20duedate%20%3D%20%22${today}%22%20AND%20status%20!%3D%20Done%20ORDER%20BY%20priority%20DESC`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useMissingComponentTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jira?endpoint=search&jql=project%20in%20(CM,OPRD)%20AND%20component%20is%20EMPTY%20ORDER%20BY%20updated%20DESC');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useDataTeamNewTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jira?endpoint=search&jql=project%20in%20(CM,OPRD)%20AND%20status%20%3D%20%22Data%20Team%20New%22%20ORDER%20BY%20updated%20DESC');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useAllTickets(): UseJiraDataReturn {
  const [data, setData] = useState<JiraSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jira?endpoint=search&jql=project%20in%20(CM,OPRD)%20ORDER%20BY%20updated%20DESC');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}