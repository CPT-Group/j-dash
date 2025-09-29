'use client';

import { OrganizationChart } from 'primereact/organizationchart';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Ticket } from '@/types/components/tickets';
import { useState } from 'react';

interface TeamOrgChartProps {
  tickets: Ticket[];
  title?: string;
  className?: string;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
  tickets: Ticket[];
  overdue: Ticket[];
  completed: Ticket[];
  avgDays: number;
  specialties: string[];
}

interface OrgNode {
  label: string;
  data: TeamMember;
  children?: OrgNode[];
  type?: string;
  styleClass?: string;
}

export default function TeamOrgChart({ 
  tickets, 
  title = "Team Organization & Performance",
  className = ""
}: TeamOrgChartProps) {
  const [orgData, setOrgData] = useState<OrgNode | null>(null);

  // Define team members and their specialties
  const teamMembers: TeamMember[] = [
    {
      name: 'Kyle Dilbeck',
      email: 'kyle@cptgroup.com',
      role: 'Website Specialist',
      tickets: tickets.filter(t => t.assignee === 'Kyle Dilbeck'),
      overdue: tickets.filter(t => t.assignee === 'Kyle Dilbeck' && t.dueDate && new Date(t.dueDate) < new Date()),
      completed: tickets.filter(t => t.assignee === 'Kyle Dilbeck' && ['Completed', 'Resolved', 'Done'].includes(t.status)),
      avgDays: 0,
      specialties: ['Website Creation', 'Web', 'Generate Passcodes']
    },
    {
      name: 'James Cassidy',
      email: 'james@cptgroup.com', 
      role: 'Database Specialist',
      tickets: tickets.filter(t => t.assignee === 'James Cassidy'),
      overdue: tickets.filter(t => t.assignee === 'James Cassidy' && t.dueDate && new Date(t.dueDate) < new Date()),
      completed: tickets.filter(t => t.assignee === 'James Cassidy' && ['Completed', 'Resolved', 'Done'].includes(t.status)),
      avgDays: 0,
      specialties: ['Database Migration', 'Data', 'Process NCOA/ACS', 'Report']
    },
    {
      name: 'Thomas Williams',
      email: 'thomas@cptgroup.com',
      role: 'Weekly Reports Specialist', 
      tickets: tickets.filter(t => t.assignee === 'Thomas Williams'),
      overdue: tickets.filter(t => t.assignee === 'Thomas Williams' && t.dueDate && new Date(t.dueDate) < new Date()),
      completed: tickets.filter(t => t.assignee === 'Thomas Williams' && ['Completed', 'Resolved', 'Done'].includes(t.status)),
      avgDays: 0,
      specialties: ['Weekly Report', 'Data Processing']
    }
  ];

  // Calculate average days for each team member
  teamMembers.forEach(member => {
    if (member.tickets.length > 0) {
      const totalDays = member.tickets.reduce((sum, ticket) => {
        const created = new Date(ticket.created);
        const now = new Date();
        return sum + Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      }, 0);
      member.avgDays = Math.round(totalDays / member.tickets.length);
    }
  });

  // Create organization chart data
  const createOrgData = (): OrgNode => {
    const teamNodes: OrgNode[] = teamMembers.map(member => ({
      label: member.name,
      data: member,
      type: 'person',
      styleClass: member.overdue.length > 0 ? 'overdue-member' : 'normal-member'
    }));

    return {
      label: 'Data Team',
      data: {
        name: 'Data Team',
        email: 'data-team@cptgroup.com',
        role: 'Development Team',
        tickets: tickets,
        overdue: tickets.filter(t => t.dueDate && new Date(t.dueDate) < new Date()),
        completed: tickets.filter(t => ['Completed', 'Resolved', 'Done'].includes(t.status)),
        avgDays: 0,
        specialties: []
      },
      children: teamNodes,
      type: 'team',
      styleClass: 'team-root'
    };
  };

  useState(() => {
    setOrgData(createOrgData());
  }, [tickets]);

  const nodeTemplate = (node: OrgNode) => {
    if (node.type === 'team') {
      return (
        <div className="p-4 bg-synth-bg-card border border-synth-border-primary rounded-lg text-center">
          <h3 className="text-lg font-bold text-synth-text-bright mb-2">
            {node.label}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-synth-text-muted">Total Tickets:</span>
              <Badge value={node.data.tickets.length} severity="info" className="ml-2" />
            </div>
            <div>
              <span className="text-synth-text-muted">Overdue:</span>
              <Badge value={node.data.overdue.length} severity="danger" className="ml-2" />
            </div>
            <div>
              <span className="text-synth-text-muted">Completed:</span>
              <Badge value={node.data.completed.length} severity="success" className="ml-2" />
            </div>
            <div>
              <span className="text-synth-text-muted">Completion Rate:</span>
              <span className="ml-2 font-semibold">
                {node.data.tickets.length > 0 
                  ? Math.round((node.data.completed.length / node.data.tickets.length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      );
    }

    const member = node.data;
    return (
      <div className="p-4 bg-synth-bg-card border border-synth-border-primary rounded-lg min-w-64">
        <div className="text-center mb-3">
          <h4 className="font-bold text-synth-text-bright text-lg mb-1">
            {member.name}
          </h4>
          <p className="text-synth-text-muted text-sm mb-2">
            {member.role}
          </p>
          <p className="text-synth-text-muted text-xs">
            {member.email}
          </p>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-synth-text-muted">Total Tickets:</span>
            <Badge value={member.tickets.length} severity="info" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-synth-text-muted">Overdue:</span>
            <Badge value={member.overdue.length} severity="danger" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-synth-text-muted">Completed:</span>
            <Badge value={member.completed.length} severity="success" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-synth-text-muted">Avg. Days:</span>
            <span className="font-semibold text-synth-text-bright">
              {member.avgDays}d
            </span>
          </div>
        </div>

        <div className="mb-3">
          <h5 className="text-sm font-semibold text-synth-text-bright mb-2">
            Specialties:
          </h5>
          <div className="flex flex-wrap gap-1">
            {member.specialties.map((specialty, index) => (
              <Tag 
                key={index}
                value={specialty} 
                severity="info"
                size="small"
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-synth-text-muted">
            Completion Rate: 
            <span className="ml-1 font-semibold text-synth-text-bright">
              {member.tickets.length > 0 
                ? Math.round((member.completed.length / member.tickets.length) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (!orgData) {
    return (
      <Card title={title} className={className}>
        <div className="text-center text-synth-text-muted">
          Loading team data...
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} className={className}>
      <div className="w-full">
        <OrganizationChart
          value={orgData}
          nodeTemplate={nodeTemplate}
          className="w-full"
          pt={{
            root: { className: 'w-full' },
            node: { className: 'p-2' }
          }}
        />
      </div>
    </Card>
  );
}
