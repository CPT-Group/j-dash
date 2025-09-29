// Dashboard Component Types
export interface DashboardStats {
  overdueCount: number;
  dueTodayCount: number;
  missingComponentsCount: number;
  dataTeamNewCount: number;
  totalTickets: number;
  teamPerformance: {
    kyle: number;
    james: number;
    thomas: number;
  };
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: 'purple' | 'cyan' | 'green' | 'orange' | 'red' | 'yellow' | 'blue' | 'pink';
  glow?: boolean;
  urgent?: boolean;
}

export interface Metric {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  urgent?: boolean;
  glow?: boolean;
}

export interface MetricGridProps {
  metrics: Metric[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
