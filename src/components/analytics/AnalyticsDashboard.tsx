'use client';

import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { useEffect, useState } from 'react';
import { Ticket } from '@/types/components/tickets';

interface AnalyticsDashboardProps {
  tickets: Ticket[];
  className?: string;
}

interface TeamPerformance {
  name: string;
  tickets: number;
  overdue: number;
  completed: number;
  avgDays: number;
}

export default function AnalyticsDashboard({ 
  tickets, 
  className = ""
}: AnalyticsDashboardProps) {
  const [priorityChartData, setPriorityChartData] = useState({});
  const [priorityChartOptions, setPriorityChartOptions] = useState({});
  
  const [componentChartData, setComponentChartData] = useState({});
  const [componentChartOptions, setComponentChartOptions] = useState({});
  
  const [teamChartData, setTeamChartData] = useState({});
  const [teamChartOptions, setTeamChartOptions] = useState({});
  
  const [timelineChartData, setTimelineChartData] = useState({});
  const [timelineChartOptions, setTimelineChartOptions] = useState({});

  useEffect(() => {
    // Priority Distribution Chart (Doughnut)
    const priorityCounts = tickets.reduce((acc, ticket) => {
      const priority = ticket.priority || 'Unassigned';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityLabels = Object.keys(priorityCounts);
    const priorityData = Object.values(priorityCounts);
    const priorityColors = [
      '#EF4444', // Highest - Red
      '#F59E0B', // High - Orange  
      '#10B981', // Medium - Green
      '#3B82F6', // Low - Blue
      '#6B7280'  // Unassigned - Gray
    ];

    setPriorityChartData({
      labels: priorityLabels,
      datasets: [
        {
          data: priorityData,
          backgroundColor: priorityColors.slice(0, priorityLabels.length),
          borderColor: priorityColors.slice(0, priorityLabels.length),
          borderWidth: 2
        }
      ]
    });

    setPriorityChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      }
    });

    // Component Distribution Chart (Pie)
    const componentCounts = tickets.reduce((acc, ticket) => {
      const component = ticket.component || 'No Component';
      acc[component] = (acc[component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count and take top 10
    const sortedComponents = Object.entries(componentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    const componentLabels = sortedComponents.map(([name]) => name);
    const componentData = sortedComponents.map(([,count]) => count);
    const componentColors = [
      '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6',
      '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6'
    ];

    setComponentChartData({
      labels: componentLabels,
      datasets: [
        {
          data: componentData,
          backgroundColor: componentColors.slice(0, componentLabels.length),
          borderColor: componentColors.slice(0, componentLabels.length),
          borderWidth: 2
        }
      ]
    });

    setComponentChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        }
      }
    });

    // Team Performance Chart (Horizontal Bar)
    const teamPerformance: TeamPerformance[] = [
      {
        name: 'Kyle Dilbeck',
        tickets: tickets.filter(t => t.assignee === 'Kyle Dilbeck').length,
        overdue: tickets.filter(t => t.assignee === 'Kyle Dilbeck' && t.dueDate && new Date(t.dueDate) < new Date()).length,
        completed: tickets.filter(t => t.assignee === 'Kyle Dilbeck' && ['Completed', 'Resolved', 'Done'].includes(t.status)).length,
        avgDays: 0
      },
      {
        name: 'James Cassidy', 
        tickets: tickets.filter(t => t.assignee === 'James Cassidy').length,
        overdue: tickets.filter(t => t.assignee === 'James Cassidy' && t.dueDate && new Date(t.dueDate) < new Date()).length,
        completed: tickets.filter(t => t.assignee === 'James Cassidy' && ['Completed', 'Resolved', 'Done'].includes(t.status)).length,
        avgDays: 0
      },
      {
        name: 'Thomas Williams',
        tickets: tickets.filter(t => t.assignee === 'Thomas Williams').length,
        overdue: tickets.filter(t => t.assignee === 'Thomas Williams' && t.dueDate && new Date(t.dueDate) < new Date()).length,
        completed: tickets.filter(t => t.assignee === 'Thomas Williams' && ['Completed', 'Resolved', 'Done'].includes(t.status)).length,
        avgDays: 0
      }
    ];

    setTeamChartData({
      labels: teamPerformance.map(t => t.name),
      datasets: [
        {
          label: 'Total Tickets',
          data: teamPerformance.map(t => t.tickets),
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          borderWidth: 1
        },
        {
          label: 'Overdue Tickets',
          data: teamPerformance.map(t => t.overdue),
          backgroundColor: '#EF4444',
          borderColor: '#EF4444',
          borderWidth: 1
        },
        {
          label: 'Completed Tickets',
          data: teamPerformance.map(t => t.completed),
          backgroundColor: '#10B981',
          borderColor: '#10B981',
          borderWidth: 1
        }
      ]
    });

    setTeamChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          stacked: false
        },
        y: {
          stacked: false
        }
      }
    });

    // Timeline Chart (Line chart showing ticket creation over time)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const timelineData = last30Days.map(date => {
      const dayTickets = tickets.filter(ticket => {
        const created = new Date(ticket.created).toISOString().split('T')[0];
        return created === date;
      });
      return dayTickets.length;
    });

    setTimelineChartData({
      labels: last30Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Tickets Created',
          data: timelineData,
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F620',
          tension: 0.4,
          fill: true
        }
      ]
    });

    setTimelineChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    });
  }, [tickets]);

  return (
    <div className={`w-full ${className}`}>
      <TabView>
        <TabPanel header="Priority Distribution" leftIcon="pi pi-chart-pie mr-2">
          <Card className="w-full">
            <div className="relative h-80">
              <Chart 
                type="doughnut" 
                data={priorityChartData} 
                options={priorityChartOptions}
                className="w-full h-full"
              />
            </div>
          </Card>
        </TabPanel>

        <TabPanel header="Component Analysis" leftIcon="pi pi-sitemap mr-2">
          <Card className="w-full">
            <div className="relative h-80">
              <Chart 
                type="pie" 
                data={componentChartData} 
                options={componentChartOptions}
                className="w-full h-full"
              />
            </div>
          </Card>
        </TabPanel>

        <TabPanel header="Team Performance" leftIcon="pi pi-users mr-2">
          <Card className="w-full">
            <div className="relative h-80">
              <Chart 
                type="bar" 
                data={teamChartData} 
                options={teamChartOptions}
                className="w-full h-full"
              />
            </div>
          </Card>
        </TabPanel>

        <TabPanel header="Timeline" leftIcon="pi pi-calendar mr-2">
          <Card className="w-full">
            <div className="relative h-80">
              <Chart 
                type="line" 
                data={timelineChartData} 
                options={timelineChartOptions}
                className="w-full h-full"
              />
            </div>
          </Card>
        </TabPanel>
      </TabView>
    </div>
  );
}
