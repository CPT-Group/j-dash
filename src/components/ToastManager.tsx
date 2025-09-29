'use client';

import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Ticket } from '@/app/page';

interface ToastManagerProps {
  tickets: Ticket[];
  previousTickets: Ticket[];
  overdueCount: number;
  previousOverdueCount: number;
  missingComponentsCount: number;
  previousMissingComponentsCount: number;
  dataTeamNewCount: number;
  previousDataTeamNewCount: number;
}

export default function ToastManager({
  tickets,
  previousTickets,
  overdueCount,
  previousOverdueCount,
  missingComponentsCount,
  previousMissingComponentsCount,
  dataTeamNewCount,
  previousDataTeamNewCount
}: ToastManagerProps) {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (!toast.current) return;

    // Check for new overdue tickets
    if (overdueCount > previousOverdueCount) {
      const newOverdueTickets = tickets.filter(ticket => 
        ticket.dueDate && 
        new Date(ticket.dueDate) < new Date() && 
        ticket.status !== 'Done' &&
        !previousTickets.some(prev => prev.key === ticket.key)
      );

      newOverdueTickets.forEach(ticket => {
        const daysOverdue = Math.floor((new Date().getTime() - new Date(ticket.dueDate!).getTime()) / (1000 * 60 * 60 * 24));
        
        toast.current?.show({
          severity: 'error',
          summary: '🚨 LATE ITEM ON ENTRY - UNFAIR!',
          detail: `${ticket.key}: ${ticket.summary} - ${daysOverdue} days overdue`,
          life: 0, // Never auto-dismiss
          sticky: true,
          closable: true
        });
      });
    }

    // Check for new tickets due today
    const today = new Date().toISOString().split('T')[0];
    const newDueTodayTickets = tickets.filter(ticket => 
      ticket.dueDate === today && 
      ticket.status !== 'Done' &&
      !previousTickets.some(prev => prev.key === ticket.key)
    );

    newDueTodayTickets.forEach(ticket => {
      toast.current?.show({
        severity: 'warn',
        summary: '⏰ DUE TODAY - URGENT!',
        detail: `${ticket.key}: ${ticket.summary} - Due today!`,
        life: 0,
        sticky: true,
        closable: true
      });
    });

    // Check for new missing component tickets
    if (missingComponentsCount > previousMissingComponentsCount) {
      const newMissingComponentTickets = tickets.filter(ticket => 
        (!ticket.component || ticket.component === 'No Component') &&
        !previousTickets.some(prev => prev.key === ticket.key)
      );

      newMissingComponentTickets.forEach(ticket => {
        toast.current?.show({
          severity: 'warn',
          summary: '🏷️ MISSING COMPONENT - JAMES NEEDS TO FIX!',
          detail: `${ticket.key}: ${ticket.summary} - No component assigned`,
          life: 0,
          sticky: true,
          closable: true
        });
      });
    }

    // Check for new Data Team New bottleneck
    if (dataTeamNewCount > previousDataTeamNewCount) {
      const newDataTeamNewTickets = tickets.filter(ticket => 
        ticket.status === 'Data Team New' &&
        !previousTickets.some(prev => prev.key === ticket.key)
      );

      newDataTeamNewTickets.forEach(ticket => {
        toast.current?.show({
          severity: 'error',
          summary: '🔄 DATA TEAM NEW BOTTLENECK - WORKFLOW BROKEN!',
          detail: `${ticket.key}: ${ticket.summary} - Stuck in Data Team New`,
          life: 0,
          sticky: true,
          closable: true
        });
      });
    }

    // Check for Case 23CV010356 crisis
    const case23CV010356Tickets = tickets.filter(ticket => 
      ticket.summary.includes('23CV010356')
    );

    if (case23CV010356Tickets.length > 0) {
      toast.current?.show({
        severity: 'error',
        summary: '🎯 CASE 23CV010356 CRISIS - RESOURCE DRAIN!',
        detail: `${case23CV010356Tickets.length} tickets for single case - All missing components!`,
        life: 0,
        sticky: true,
        closable: true
      });
    }

    // Check for high priority tickets without due dates
    const highPriorityNoDueDate = tickets.filter(ticket => 
      (ticket.priority === 'High' || ticket.priority === 'Highest') &&
      !ticket.dueDate &&
      ticket.status !== 'Done'
    );

    if (highPriorityNoDueDate.length > 0) {
      toast.current?.show({
        severity: 'warn',
        summary: '⚠️ HIGH PRIORITY NO DUE DATE - PLANNING ISSUE!',
        detail: `${highPriorityNoDueDate.length} high priority tickets without due dates`,
        life: 0,
        sticky: true,
        closable: true
      });
    }

    // Check for tickets stuck in Data Team New for too long
    const stuckDataTeamNew = tickets.filter(ticket => 
      ticket.status === 'Data Team New' &&
      ticket.created &&
      (new Date().getTime() - new Date(ticket.created).getTime()) > (3 * 24 * 60 * 60 * 1000) // 3 days
    );

    if (stuckDataTeamNew.length > 0) {
      toast.current?.show({
        severity: 'error',
        summary: '🐌 STUCK IN DATA TEAM NEW - ESCALATION NEEDED!',
        detail: `${stuckDataTeamNew.length} tickets stuck >3 days in Data Team New`,
        life: 0,
        sticky: true,
        closable: true
      });
    }

    // Check for tickets with 53+ days overdue (crisis cluster)
    const crisisOverdue = tickets.filter(ticket => 
      ticket.dueDate &&
      new Date(ticket.dueDate) < new Date() &&
      ticket.status !== 'Done' &&
      (new Date().getTime() - new Date(ticket.dueDate).getTime()) > (53 * 24 * 60 * 60 * 1000) // 53 days
    );

    if (crisisOverdue.length > 0) {
      toast.current?.show({
        severity: 'error',
        summary: '💥 53+ DAYS OVERDUE CRISIS CLUSTER!',
        detail: `${crisisOverdue.length} tickets 53+ days overdue - MASSIVE BACKLOG!`,
        life: 0,
        sticky: true,
        closable: true
      });
    }

    // Check for team workload imbalance
    const kyleTickets = tickets.filter(t => t.assignee === 'Kyle Dilbeck' && t.status !== 'Done').length;
    const jamesTickets = tickets.filter(t => t.assignee === 'James Cassidy' && t.status !== 'Done').length;
    const thomasTickets = tickets.filter(t => t.assignee === 'Thomas Williams' && t.status !== 'Done').length;

    const maxTickets = Math.max(kyleTickets, jamesTickets, thomasTickets);
    const minTickets = Math.min(kyleTickets, jamesTickets, thomasTickets);

    if (maxTickets > 0 && (maxTickets - minTickets) > 10) {
      toast.current?.show({
        severity: 'warn',
        summary: '⚖️ TEAM WORKLOAD IMBALANCE!',
        detail: `Kyle: ${kyleTickets}, James: ${jamesTickets}, Thomas: ${thomasTickets} - Redistribute work!`,
        life: 0,
        sticky: true,
        closable: true
      });
    }

    // Check for component assignment crisis
    if (missingComponentsCount > 50) {
      toast.current?.show({
        severity: 'error',
        summary: '🏷️ COMPONENT ASSIGNMENT CRISIS!',
        detail: `${missingComponentsCount} tickets missing components - James manually assigns every morning!`,
        life: 0,
        sticky: true,
        closable: true
      });
    }

    // Check for Request Complete bottleneck
    const requestCompleteTickets = tickets.filter(ticket => 
      ticket.status === 'Request Complete'
    );

    if (requestCompleteTickets.length > 5) {
      toast.current?.show({
        severity: 'warn',
        summary: '📋 REQUEST COMPLETE BOTTLENECK!',
        detail: `${requestCompleteTickets.length} tickets stuck in Request Complete - Approval needed!`,
        life: 0,
        sticky: true,
        closable: true
      });
    }

  }, [tickets, previousTickets, overdueCount, previousOverdueCount, missingComponentsCount, previousMissingComponentsCount, dataTeamNewCount, previousDataTeamNewCount]);

  return <Toast ref={toast} position="top-right" />;
}
