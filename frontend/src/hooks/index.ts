/**
 * Admin Hooks
 * Central export point for all admin-related hooks
 */

// Moderation hooks
export {
  useModerationQueue,
  useResolveReport,
  useAssignReport,
  useModerationStats,
} from './use-moderation';

// Admin analytics hooks
export {
  useAdminStats,
  usePlatformAnalytics,
  type PlatformAnalytics,
} from './use-admin-analytics';

// User management hooks
export {
  useUserList,
  useUserWarnings,
  useUserBans,
  useIssueWarning,
  useIssueBan,
  useLiftBan,
  type UserListQuery,
} from './use-user-management';
