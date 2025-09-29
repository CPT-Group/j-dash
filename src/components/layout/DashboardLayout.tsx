'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-synth-bg-primary">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-synth-text-bright mb-2">
            {title}
          </h1>
          <p className="text-synth-text-muted text-lg">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
