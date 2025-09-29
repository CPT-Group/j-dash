'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color: 'purple' | 'cyan' | 'green' | 'orange' | 'red' | 'yellow' | 'blue' | 'pink';
  glow?: boolean;
  urgent?: boolean;
}

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color, 
  glow = false,
  urgent = false
}: MetricCardProps) {
  const colorClasses = {
    purple: 'text-synth-neon-purple bg-synth-neon-purple/10 border-synth-neon-purple/30',
    cyan: 'text-synth-neon-cyan bg-synth-neon-cyan/10 border-synth-neon-cyan/30',
    green: 'text-synth-neon-green bg-synth-neon-green/10 border-synth-neon-green/30',
    orange: 'text-synth-neon-orange bg-synth-neon-orange/10 border-synth-neon-orange/30',
    red: 'text-synth-status-error bg-synth-status-error/10 border-synth-status-error/30',
    yellow: 'text-synth-neon-yellow bg-synth-neon-yellow/10 border-synth-neon-yellow/30',
    blue: 'text-synth-neon-blue bg-synth-neon-blue/10 border-synth-neon-blue/30',
    pink: 'text-synth-neon-pink bg-synth-neon-pink/10 border-synth-neon-pink/30',
  };

  const shadowClasses = {
    purple: 'shadow-neon',
    cyan: 'shadow-neon-cyan',
    green: 'shadow-neon-green',
    orange: 'shadow-neon-orange',
    red: 'shadow-neon-orange',
    yellow: 'shadow-neon-orange',
    blue: 'shadow-neon-cyan',
    pink: 'shadow-neon',
  };

  return (
    <div className={`
      bg-synth-bg-card border border-synth-border-primary rounded-lg p-6 h-full
      transition-all duration-300 hover:scale-105 hover:shadow-lg
      ${glow ? `animate-glow ${shadowClasses[color]}` : ''}
      ${urgent ? 'animate-neon-pulse' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-synth-text-muted text-sm font-medium mb-2">
            {title}
          </div>
          <div className="text-synth-text-bright text-3xl font-bold mb-2">
            {value}
          </div>
          {trend !== undefined && (
            <div className={`
              flex items-center text-sm font-medium
              ${trend > 0 ? 'text-synth-status-error' : 'text-synth-neon-green'}
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
          ${colorClasses[color]}
          ${glow ? 'animate-glow' : ''}
        `}>
          <Icon className={`w-8 h-8 ${urgent ? 'animate-neon-pulse' : ''}`} />
        </div>
      </div>
    </div>
  );
}
