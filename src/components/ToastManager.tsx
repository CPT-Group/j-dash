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
      const newOverdueCount = overdueCount - previousOverdueCount;
      toast.current?.show({
        severity: 'error',
        summary: '🚨 New Overdue Tickets',
        detail: `${newOverdueCount} tickets became overdue`,
        life: 30000, // 30 seconds
        sticky: false,
        closable: true
      });
    }

    // Check for completed tickets (green toasts)
    const completedTickets = tickets.filter(ticket => 
      ticket.status === 'Done' && 
      !previousTickets.some(prev => prev.key === ticket.key && prev.status !== 'Done')
    );

    if (completedTickets.length > 0) {
      toast.current?.show({
        severity: 'success',
        summary: '✅ Tickets Completed',
        detail: `${completedTickets.length} tickets completed`,
        life: 30000, // 30 seconds
        sticky: false,
        closable: true
      });
    }

    // Check for new tickets due today
    const today = new Date().toISOString().split('T')[0];
    const newDueTodayTickets = tickets.filter(ticket => 
      ticket.dueDate === today && 
      ticket.status !== 'Done' &&
      !previousTickets.some(prev => prev.key === ticket.key)
    );

    if (newDueTodayTickets.length > 0) {
      toast.current?.show({
        severity: 'warn',
        summary: '⏰ Due Today',
        detail: `${newDueTodayTickets.length} tickets due today`,
        life: 30000, // 30 seconds
        sticky: false,
        closable: true
      });
    }

    // Check for new missing component tickets
    if (missingComponentsCount > previousMissingComponentsCount) {
      const newMissingCount = missingComponentsCount - previousMissingComponentsCount;
      toast.current?.show({
        severity: 'info',
        summary: '🏷️ Missing Components',
        detail: `${newMissingCount} tickets missing components`,
        life: 30000, // 30 seconds
        sticky: false,
        closable: true
      });
    }

    // Check for Data Team New bottleneck
    if (dataTeamNewCount > previousDataTeamNewCount) {
      const newDataTeamNewCount = dataTeamNewCount - previousDataTeamNewCount;
      toast.current?.show({
        severity: 'warn',
        summary: '🔄 Data Team New Bottleneck',
        detail: `${newDataTeamNewCount} tickets stuck in Data Team New`,
        life: 30000, // 30 seconds
        sticky: false,
        closable: true
      });
    }

    // Check for tickets that moved out of Data Team New (positive)
    const previousDataTeamNewTickets = previousTickets.filter(t => t.status === 'Data Team New');
    const currentDataTeamNewTickets = tickets.filter(t => t.status === 'Data Team New');
    const movedOutOfDataTeamNew = previousDataTeamNewTickets.filter(prev => 
      !currentDataTeamNewTickets.some(current => current.key === prev.key)
    );

    if (movedOutOfDataTeamNew.length > 0) {
      toast.current?.show({
        severity: 'success',
        summary: '🚀 Workflow Progress',
        detail: `${movedOutOfDataTeamNew.length} tickets moved out of Data Team New`,
        life: 30000, // 30 seconds
        sticky: false,
        closable: true
      });
    }

    // Check for tickets that got components assigned (positive)
    const previousMissingComponentTickets = previousTickets.filter(t => t.component === 'No Component');
    const currentMissingComponentTickets = tickets.filter(t => t.component === 'No Component');
    const gotComponentsAssigned = previousMissingComponentTickets.filter(prev => 
      !currentMissingComponentTickets.some(current => current.key === prev.key)
    );

    if (gotComponentsAssigned.length > 0) {
      toast.current?.show({
        severity: 'success',
        summary: '🏷️ Components Assigned',
        detail: `${gotComponentsAssigned.length} tickets got components assigned`,
        life: 30000, // 30 seconds
        sticky: false,
        closable: true
      });
    }

    // Check for critical issues (persistent toasts)
    if (overdueCount > 50) {
      toast.current?.show({
        severity: 'error',
        summary: '🚨 CRITICAL: Overdue Crisis',
        detail: `${overdueCount} tickets overdue - Immediate attention needed!`,
        life: 0, // Never auto-dismiss
        sticky: true,
        closable: true
      });
    }

    if (missingComponentsCount > 50) {
      toast.current?.show({
        severity: 'error',
        summary: '🚨 CRITICAL: Component Crisis',
        detail: `${missingComponentsCount} tickets missing components - James needs help!`,
        life: 0, // Never auto-dismiss
        sticky: true,
        closable: true
      });
    }

    if (dataTeamNewCount > 10) {
      toast.current?.show({
        severity: 'error',
        summary: '🚨 CRITICAL: Workflow Bottleneck',
        detail: `${dataTeamNewCount} tickets stuck in Data Team New - Process broken!`,
        life: 0, // Never auto-dismiss
        sticky: true,
        closable: true
      });
    }

  }, [
    tickets, 
    previousTickets, 
    overdueCount, 
    previousOverdueCount, 
    missingComponentsCount, 
    previousMissingComponentsCount,
    dataTeamNewCount,
    previousDataTeamNewCount
  ]);

  return <Toast ref={toast} position="top-right" />;
}