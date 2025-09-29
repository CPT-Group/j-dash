'use client';

import { Card } from 'primereact/card';
import { MetricCardProps } from '@/types';

export default function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'purple', 
  glow = false, 
  urgent = false,
  subtitle
}: MetricCardProps) {
  const colorClasses = {
    purple: 'border-synth-neon-purple bg-synth-bg-card',
    cyan: 'border-synth-neon-cyan bg-synth-bg-card',
    green: 'border-synth-neon-green bg-synth-bg-card',
    orange: 'border-synth-neon-orange bg-synth-bg-card',
    red: 'border-synth-error bg-synth-bg-card',
    yellow: 'border-synth-warning bg-synth-bg-card',
    blue: 'border-synth-info bg-synth-bg-card',
    pink: 'border-synth-accent bg-synth-bg-card',
  };

  return (
    <Card className={`
      ${urgent ? 'border-2 border-synth-error' : 'border border-synth-border-primary'}
      ${glow ? 'animate-glow' : ''}
      transition-all duration-300 hover:scale-105
    `}>
      <div className="flex items-center justify-between p-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-synth-text-bright mb-2">
            {title}
          </h3>
          <div className="text-3xl font-bold text-synth-text-primary mb-2">
            {value}
          </div>
          {subtitle && (
            <div className="text-synth-text-muted text-xs mb-2">
              {subtitle}
            </div>
          )}
          {trend !== undefined && (
            <div className={`
              flex items-center text-sm font-medium
              ${trend > 0 ? 'text-synth-error' : 'text-synth-neon-green'}
            `}>
              <span className="mr-1">
                {trend > 0 ? '↗' : '↘'}
              </span>
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className={`
          p-4 rounded-lg border-2
          ${colorClasses[color || 'purple']}
          ${glow ? 'animate-glow' : ''}
        `}>
          <div className={`w-8 h-8 ${urgent ? 'animate-neon-pulse' : ''}`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}