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
        // Only show active tickets that are overdue (exclude Resolved with Done resolution)
        const activeStatuses = '"Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA"';
        const jql = `project in (CM,OPRD) AND status in (${activeStatuses}) AND duedate < now() ORDER BY duedate ASC`;
        const response = await fetch(`/api/jira?endpoint=search&jql=${encodeURIComponent(jql)}`);
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
        // Only show active tickets due today (exclude Resolved with Done resolution)
        const activeStatuses = '"Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA"';
        const jql = `project in (CM,OPRD) AND status in (${activeStatuses}) AND duedate = "${today}" ORDER BY priority DESC`;
        const response = await fetch(`/api/jira?endpoint=search&jql=${encodeURIComponent(jql)}`);
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
        // Only show active tickets missing components (exclude Resolved with Done resolution)
        const activeStatuses = '"Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA"';
        const jql = `project in (CM,OPRD) AND status in (${activeStatuses}) AND component is EMPTY ORDER BY updated DESC`;
        const response = await fetch(`/api/jira?endpoint=search&jql=${encodeURIComponent(jql)}`);
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
        // Only show active Data Team New tickets (exclude Resolved with Done resolution)
        const activeStatuses = '"Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA"';
        const jql = `project in (CM,OPRD) AND status in (${activeStatuses}) AND status = "Data Team New" ORDER BY updated DESC`;
        const response = await fetch(`/api/jira?endpoint=search&jql=${encodeURIComponent(jql)}`);
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
        // Only show active tickets (exclude Resolved with Done resolution)
        const activeStatuses = '"Completed", "REQUIREMENT REVIEW", "To Do", "Request Complete", "UAT", "New", "In Progress", "PEER TESTING", "Data Team New", "Data Team Testing", "Open", "Waiting", "Waiting QA"';
        const jql = `project in (CM,OPRD) AND status in (${activeStatuses}) ORDER BY updated DESC`;
        const response = await fetch(`/api/jira?endpoint=search&jql=${encodeURIComponent(jql)}`);
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