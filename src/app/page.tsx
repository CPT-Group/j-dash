'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  Activity,
  Target,
  Zap
} from 'lucide-react';

// Mock data for demonstration
const sprintData = [
  { name: 'Mon', completed: 12, remaining: 28 },
  { name: 'Tue', completed: 19, remaining: 21 },
  { name: 'Wed', completed: 25, remaining: 15 },
  { name: 'Thu', completed: 30, remaining: 10 },
  { name: 'Fri', completed: 35, remaining: 5 },
  { name: 'Sat', completed: 38, remaining: 2 },
  { name: 'Sun', completed: 40, remaining: 0 },
];

const velocityData = [
  { sprint: 'Sprint 1', points: 32 },
  { sprint: 'Sprint 2', points: 28 },
  { sprint: 'Sprint 3', points: 35 },
  { sprint: 'Sprint 4', points: 42 },
  { sprint: 'Sprint 5', points: 38 },
  { sprint: 'Sprint 6', points: 45 },
];

const issueStatusData = [
  { name: 'To Do', value: 15, color: '#FFAB00' },
  { name: 'In Progress', value: 8, color: '#0052CC' },
  { name: 'Done', value: 27, color: '#36B37E' },
  { name: 'Blocked', value: 3, color: '#FF5630' },
];

const teamPerformance = [
  { name: 'Alice Johnson', completed: 12, inProgress: 3, efficiency: 95 },
  { name: 'Bob Smith', completed: 8, inProgress: 5, efficiency: 78 },
  { name: 'Carol Davis', completed: 15, inProgress: 2, efficiency: 88 },
  { name: 'David Wilson', completed: 10, inProgress: 4, efficiency: 82 },
];

export default function Dashboard() {
  const [jiraToken, setJiraToken] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const projects = [
    { label: 'Project Alpha', value: 'alpha' },
    { label: 'Project Beta', value: 'beta' },
    { label: 'Project Gamma', value: 'gamma' },
  ];

  const handleConnect = () => {
    if (jiraToken) {
      setIsConnected(true);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: any) => (
    <Card className="h-full">
      <div className="flex align-items-center justify-content-between">
        <div>
          <div className="text-600 text-sm font-medium mb-1">{title}</div>
          <div className="text-900 text-2xl font-bold">{value}</div>
          {trend && (
            <div className={`flex align-items-center mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <div className={`p-3 border-round-lg bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom-1 border-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex align-items-center justify-content-between">
            <div className="flex align-items-center">
              <div className="bg-jira-blue text-white p-2 border-round-lg mr-3">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-900 m-0">J-Dash</h1>
                <p className="text-600 text-sm m-0">Beautiful Jira Analytics</p>
              </div>
            </div>
            
            {!isConnected ? (
              <div className="flex align-items-center gap-3">
                <InputText
                  placeholder="Enter Jira API Token"
                  value={jiraToken}
                  onChange={(e) => setJiraToken(e.target.value)}
                  className="w-20rem"
                />
                <Button 
                  label="Connect" 
                  icon="pi pi-link" 
                  onClick={handleConnect}
                  className="p-button-primary"
                />
              </div>
            ) : (
              <div className="flex align-items-center gap-3">
                <Dropdown
                  value={selectedProject}
                  options={projects}
                  onChange={(e) => setSelectedProject(e.value)}
                  placeholder="Select Project"
                  className="w-15rem"
                />
                <Badge value="Connected" severity="success" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!isConnected ? (
          <div className="text-center py-8">
            <div className="bg-white border-round-lg shadow-2 p-6 max-w-md mx-auto">
              <div className="bg-blue-50 p-4 border-round-lg mb-4">
                <Activity className="w-12 h-12 text-blue-600 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-900 mb-3">Connect to Jira</h2>
              <p className="text-600 mb-4">
                Enter your Jira API token to start analyzing your project data with beautiful visualizations.
              </p>
              <div className="text-left">
                <h4 className="text-900 mb-2">How to get your API token:</h4>
                <ol className="text-600 text-sm line-height-3">
                  <li>Go to your Jira account settings</li>
                  <li>Navigate to Security → API tokens</li>
                  <li>Create a new token</li>
                  <li>Copy and paste it above</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid mb-6">
              <div className="col-12 md:col-6 lg:col-3">
                <StatCard
                  title="Total Issues"
                  value="1,247"
                  icon={Target}
                  trend={12}
                  color="blue"
                />
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <StatCard
                  title="Completed This Sprint"
                  value="38"
                  icon={CheckCircle}
                  trend={8}
                  color="green"
                />
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <StatCard
                  title="In Progress"
                  value="23"
                  icon={Clock}
                  trend={-5}
                  color="orange"
                />
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <StatCard
                  title="Team Velocity"
                  value="42"
                  icon={Zap}
                  trend={15}
                  color="purple"
                />
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid mb-6">
              <div className="col-12 lg:col-8">
                <Card title="Sprint Burndown" className="h-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={sprintData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="remaining" 
                        stackId="1" 
                        stroke="#FF5630" 
                        fill="#FF5630" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completed" 
                        stackId="1" 
                        stroke="#36B37E" 
                        fill="#36B37E" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <div className="col-12 lg:col-4">
                <Card title="Issue Status" className="h-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={issueStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {issueStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>

            {/* Velocity and Team Performance */}
            <div className="grid mb-6">
              <div className="col-12 lg:col-6">
                <Card title="Sprint Velocity Trend" className="h-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={velocityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sprint" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke="#0052CC" 
                        strokeWidth={3}
                        dot={{ fill: '#0052CC', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <div className="col-12 lg:col-6">
                <Card title="Team Performance" className="h-full">
                  <div className="space-y-4">
                    {teamPerformance.map((member, index) => (
                      <div key={index} className="flex align-items-center justify-content-between p-3 bg-gray-50 border-round">
                        <div>
                          <div className="font-semibold text-900">{member.name}</div>
                          <div className="text-600 text-sm">
                            {member.completed} completed • {member.inProgress} in progress
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-900 font-bold">{member.efficiency}%</div>
                          <ProgressBar 
                            value={member.efficiency} 
                            className="w-8rem mt-1"
                            showValue={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card title="Recent Activity">
              <div className="space-y-3">
                {[
                  { action: 'Issue #JIRA-123 completed', user: 'Alice Johnson', time: '2 minutes ago', type: 'success' },
                  { action: 'Issue #JIRA-124 moved to In Progress', user: 'Bob Smith', time: '15 minutes ago', type: 'info' },
                  { action: 'Issue #JIRA-125 created', user: 'Carol Davis', time: '1 hour ago', type: 'info' },
                  { action: 'Sprint 23 started', user: 'David Wilson', time: '2 hours ago', type: 'warning' },
                ].map((activity, index) => (
                  <div key={index} className="flex align-items-center p-3 border-round bg-gray-50">
                    <div className={`w-2 h-2 border-round-full mr-3 ${
                      activity.type === 'success' ? 'bg-green-500' : 
                      activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-900">{activity.action}</div>
                      <div className="text-600 text-sm">{activity.user} • {activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
