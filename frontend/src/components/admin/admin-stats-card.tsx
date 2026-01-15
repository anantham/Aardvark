'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

/**
 * Admin statistics card component for dashboard metrics
 */
export function AdminStatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
}: AdminStatsCardProps) {
  const variantColors = {
    default: 'text-primary',
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  };

  const trendColor = trend
    ? trend.value > 0
      ? 'text-green-600'
      : trend.value < 0
      ? 'text-red-600'
      : 'text-muted-foreground'
    : '';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', variantColors[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className={cn('text-xs mt-1 flex items-center gap-1', trendColor)}>
            <span className="font-medium">
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
