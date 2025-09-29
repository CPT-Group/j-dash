'use client';

import { Card } from 'primereact/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color: 'purple' | 'cyan' | 'green' | 'orange' | 'red' | 'yellow' | 'blue' | 'pink';
  glow?: boolean;
  urgent?: boolean;
  subtitle?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color, 
  glow = false,
  urgent = false,
  subtitle
}: MetricCardProps) {
  const colorClasses = {
    purple: 'text-synth-neon-purple bg-synth-neon-purple/10 border-synth-neon-purple/30',
    cyan: 'text-synth-neon-cyan bg-synth-neon-cyan/10 border-synth-neon-cyan/30',
    green: 'text-synth-neon-green bg-synth-neon-green/10 border-synth-neon-green/30',
    orange: 'text-synth-neon-orange bg-synth-neon-orange/10 border-synth-neon-orange/30',
    red: 'text-synth-error bg-synth-error/10 border-synth-error/30',
    yellow: 'text-synth-neon-yellow bg-synth-neon-yellow/10 border-synth-neon-yellow/30',
    blue: 'text-synth-neon-blue bg-synth-neon-blue/10 border-synth-neon-blue/30',
    pink: 'text-synth-neon-pink bg-synth-neon-pink/10 border-synth-neon-pink/30',
  };

  return (
    <Card className={`
      h-full transition-all duration-300 hover:scale-105
      ${glow ? 'animate-glow' : ''}
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
          ${colorClasses[color]}
          ${glow ? 'animate-glow' : ''}
        `}>
          <Icon className={`w-8 h-8 ${urgent ? 'animate-neon-pulse' : ''}`} />
        </div>
      </div>
    </Card>
  );
}
