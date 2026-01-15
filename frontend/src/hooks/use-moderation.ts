'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import type {
  ModerationQueueItem,
  ModerationQueueQuery,
  ModerationStats,
  ResolveModerationDto,
  PaginatedResponse,
} from '@aardvark/shared';

/**
 * Hook for fetching moderation queue
 */
export function useModerationQueue(query: ModerationQueueQuery, token?: string) {
  return useQuery({
    queryKey: ['moderationQueue', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });

      return fetchApi<PaginatedResponse<ModerationQueueItem>>(
        `/admin/moderation/queue?${params}`,
        { token }
      );
    },
    enabled: !!token,
  });
}

/**
 * Hook for resolving moderation reports
 */
export function useResolveReport(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reportId,
      data,
    }: {
      reportId: string;
      data: ResolveModerationDto;
    }) =>
      fetchApi<void>(`/admin/moderation/reports/${reportId}/resolve`, {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['moderationStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

/**
 * Hook for assigning moderation reports to moderators
 */
export function useAssignReport(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) =>
      fetchApi<void>(`/admin/moderation/reports/${reportId}/assign`, {
        method: 'POST',
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

/**
 * Hook for fetching moderation statistics
 */
export function useModerationStats(token?: string) {
  return useQuery({
    queryKey: ['moderationStats'],
    queryFn: () =>
      fetchApi<ModerationStats>('/admin/moderation/stats', { token }),
    enabled: !!token,
    refetchInterval: 60000, // Refetch every minute
  });
}
