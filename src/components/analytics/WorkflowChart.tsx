'use client';

import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { Ticket } from '@/types/components/tickets';

interface WorkflowChartProps {
  tickets: Ticket[];
  title?: string;
  className?: string;
}

interface WorkflowData {
  status: string;
  count: number;
  color: string;
  avgDays: number;
}

export default function WorkflowChart({ 
  tickets, 
  title = "Workflow Status Distribution",
  className = ""
}: WorkflowChartProps) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // Define workflow statuses with their colors and categories
  const statusConfig = {
    // Data Team Workflow
    'New': { color: '#3B82F6', category: 'Initial', priority: 1 },
    'Requested': { color: '#8B5CF6', category: 'Initial', priority: 2 },
    'Data Team New': { color: '#EF4444', category: 'Data Team', priority: 3 },
    'Data Team In Progress': { color: '#F59E0B', category: 'Data Team', priority: 4 },
    'Data Team Testing': { color: '#10B981', category: 'Data Team', priority: 5 },
    'Data Team Complete': { color: '#06B6D4', category: 'Data Team', priority: 6 },
    'Request Complete': { color: '#84CC16', category: 'Final', priority: 7 },
    'Completed': { color: '#22C55E', category: 'Final', priority: 8 },
    
    // OPRD Workflow
    'To Do': { color: '#6B7280', category: 'Initial', priority: 1 },
    'REQUIREMENT REVIEW': { color: '#8B5CF6', category: 'Review', priority: 2 },
    'DEVELOPMENT': { color: '#F59E0B', category: 'Development', priority: 3 },
    'PEER TESTING': { color: '#10B981', category: 'Testing', priority: 4 },
    'QA/QC': { color: '#06B6D4', category: 'Testing', priority: 5 },
    'UAT': { color: '#84CC16', category: 'Testing', priority: 6 },
    'Resolved': { color: '#22C55E', category: 'Final', priority: 7 },
    
    // Other statuses
    'In Progress': { color: '#F59E0B', category: 'Active', priority: 3 },
    'Open': { color: '#EF4444', category: 'Active', priority: 2 },
    'Done': { color: '#22C55E', category: 'Final', priority: 8 }
  };

  useEffect(() => {
    // Process tickets to get workflow data
    const workflowData: WorkflowData[] = [];
    const statusCounts: { [key: string]: { count: number; totalDays: number; daysCount: number } } = {};

    // Count tickets by status and calculate average days
    tickets.forEach(ticket => {
      const status = ticket.status;
      if (!statusCounts[status]) {
        statusCounts[status] = { count: 0, totalDays: 0, daysCount: 0 };
      }
      statusCounts[status].count++;
      
      // Calculate days since creation
      const created = new Date(ticket.created);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      statusCounts[status].totalDays += daysDiff;
      statusCounts[status].daysCount++;
    });

    // Convert to workflow data array
    Object.entries(statusCounts).forEach(([status, data]) => {
      const config = statusConfig[status as keyof typeof statusConfig] || { 
        color: '#6B7280', 
        category: 'Other', 
        priority: 99 
      };
      
      workflowData.push({
        status,
        count: data.count,
        color: config.color,
        avgDays: Math.round(data.totalDays / data.daysCount)
      });
    });

    // Sort by priority and count
    workflowData.sort((a, b) => {
      const aConfig = statusConfig[a.status as keyof typeof statusConfig];
      const bConfig = statusConfig[b.status as keyof typeof statusConfig];
      const aPriority = aConfig?.priority || 99;
      const bPriority = bConfig?.priority || 99;
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.count - a.count;
    });

    // Prepare chart data
    const labels = workflowData.map(item => item.status);
    const data = workflowData.map(item => item.count);
    const backgroundColor = workflowData.map(item => item.color);
    const borderColor = workflowData.map(item => item.color);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Tickets by Status',
          data,
          backgroundColor,
          borderColor,
          borderWidth: 2,
          hoverBackgroundColor: backgroundColor.map(color => 
            color + '80' // Add transparency for hover
          )
        }
      ]
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: { dataIndex: number }) {
              const index = context.dataIndex;
              const item = workflowData[index];
              return [
                `${item.status}: ${item.count} tickets`,
                `Avg. ${item.avgDays} days in status`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    });
  }, [tickets]);

  return (
    <Card 
      title={title}
      className={`w-full ${className}`}
      pt={{
        content: { className: 'p-0' },
        title: { className: 'text-lg font-semibold mb-4' }
      }}
    >
      <div className="relative h-96">
        <Chart 
          type="bar" 
          data={chartData} 
          options={chartOptions}
          className="w-full h-full"
        />
      </div>
      
      {/* Status Legend with Categories */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = tickets.filter(t => t.status === status).length;
          if (count === 0) return null;
          
          return (
            <div key={status} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: config.color }}
              />
              <span className="text-synth-text-muted">{status}:</span>
              <span className="font-medium text-synth-text-bright">{count}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
