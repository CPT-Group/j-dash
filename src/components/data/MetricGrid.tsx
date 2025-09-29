'use client';

import MetricCard from '../MetricCard';
import { Metric, MetricGridProps } from '@/types';

export default function MetricGrid({ 
  metrics, 
  columns = 4, 
  className = '' 
}: MetricGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          icon={metric.icon}
          trend={metric.trend === 'up' ? 1 : metric.trend === 'down' ? -1 : 0}
          urgent={metric.urgent}
          glow={metric.glow}
        />
      ))}
    </div>
  );
}