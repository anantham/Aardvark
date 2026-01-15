'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import type {
  ModerationStats,
  PlatformHealthMetrics,
} from '@aardvark/shared';

/**
 * Platform analytics data structure
 */
export interface PlatformAnalytics {
  users: {
    total: number;
    active24h: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    byRole: Record<string, number>;
  };
  content: {
    totalStories: number;
    storiesPublishedToday: number;
    storiesPublishedThisWeek: number;
    storiesPublishedThisMonth: number;
    totalSegments: number;
    totalComments: number;
    commentsToday: number;
  };
  engagement: {
    totalReads: number;
    readsToday: number;
    averageReadTime: number;
    completionRate: number;
    ratingsCount: number;
    averageRating: number;
  };
  revenue: {
    totalRevenue: number;
    revenueToday: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
    creditsPurchased: number;
    creditsSpent: number;
    activeSubscriptions: number;
  };
  system: {
    errorRate: number;
    averageResponseTime: number;
    uptime: number;
    activeConnections: number;
  };
}

/**
 * Hook for fetching admin dashboard stats
 */
export function useAdminStats(token?: string) {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () =>
      fetchApi<{
        moderation: ModerationStats;
        health: PlatformHealthMetrics;
      }>('/admin/stats', { token }),
    enabled: !!token,
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook for fetching comprehensive platform analytics
 */
export function usePlatformAnalytics(
  period: 'day' | 'week' | 'month' | 'year' = 'day',
  token?: string
) {
  return useQuery({
    queryKey: ['platformAnalytics', period],
    queryFn: () =>
      fetchApi<PlatformAnalytics>(`/admin/analytics?period=${period}`, {
        token,
      }),
    enabled: !!token,
  });
}
