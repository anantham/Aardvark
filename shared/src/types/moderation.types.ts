/**
 * Moderation system type definitions for Aardvark Platform
 * Handles content moderation, user reports, and admin actions
 */

// ============================================================================
// Content Moderation
// ============================================================================

export enum ContentType {
  STORY = 'story',
  SEGMENT = 'segment',
  COMMENT = 'comment',
  REVIEW = 'review',
  FORUM_THREAD = 'forum_thread',
  FORUM_POST = 'forum_post',
  MESSAGE = 'message',
  USER_PROFILE = 'user_profile',
  COLLECTION = 'collection',
}

export enum ReportReason {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  COPYRIGHT = 'copyright',
  IMPERSONATION = 'impersonation',
  MISINFORMATION = 'misinformation',
  SELF_HARM = 'self_harm',
  ILLEGAL_CONTENT = 'illegal_content',
  OTHER = 'other',
}

export enum ModerationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ESCALATED = 'escalated',
  DISMISSED = 'dismissed',
}

export enum ModerationAction {
  APPROVE = 'approve',
  REMOVE = 'remove',
  EDIT = 'edit',
  WARN_USER = 'warn_user',
  TEMP_BAN = 'temp_ban',
  PERM_BAN = 'perm_ban',
  SHADOW_BAN = 'shadow_ban',
  DISMISS = 'dismiss',
  ESCALATE = 'escalate',
}

/**
 * User report of content
 */
export interface Report {
  id: string;
  reporterId: string;
  contentType: ContentType;
  contentId: string;
  reason: ReportReason;
  description: string;
  evidence: string[]; // URLs or text snippets
  status: ModerationStatus;
  assignedModeratorId: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
}

/**
 * Moderation queue item
 */
export interface ModerationQueueItem {
  id: string;
  contentType: ContentType;
  contentId: string;
  content: unknown; // The actual content object
  reportIds: string[]; // Related reports
  reportCount: number;
  source: 'user_report' | 'auto_flagged' | 'manual_review';
  autoFlagReasons: string[];
  status: ModerationStatus;
  assignedModeratorId: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Moderation action log
 */
export interface ModerationLog {
  id: string;
  moderatorId: string;
  contentType: ContentType;
  contentId: string;
  queueItemId: string | null;
  action: ModerationAction;
  reason: string;
  details: Record<string, unknown>;
  previousState: unknown; // Content state before action
  createdAt: Date;
}

// ============================================================================
// User Moderation
// ============================================================================

export enum BanType {
  TEMPORARY = 'temporary',
  PERMANENT = 'permanent',
  SHADOW = 'shadow',
}

export enum BanScope {
  FULL = 'full', // Complete platform ban
  POSTING = 'posting', // Can't create content
  COMMENTING = 'commenting', // Can't comment
  MESSAGING = 'messaging', // Can't send messages
}

/**
 * User warning record
 */
export interface UserWarning {
  id: string;
  userId: string;
  issuedById: string;
  reason: string;
  relatedContentType: ContentType | null;
  relatedContentId: string | null;
  acknowledged: boolean;
  acknowledgedAt: Date | null;
  expiresAt: Date | null; // Warnings can expire
  createdAt: Date;
}

/**
 * User ban record
 */
export interface UserBan {
  id: string;
  userId: string;
  issuedById: string;
  type: BanType;
  scope: BanScope;
  reason: string;
  relatedReportIds: string[];
  startsAt: Date;
  expiresAt: Date | null; // Null for permanent bans
  isActive: boolean;
  appealStatus: 'none' | 'pending' | 'approved' | 'denied';
  appealText: string | null;
  appealReviewedById: string | null;
  appealReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User strike for 3-strikes policy tracking
 */
export interface UserStrike {
  id: string;
  userId: string;
  issuedById: string;
  reason: string;
  warningId: string | null;
  banId: string | null;
  severity: 1 | 2 | 3;
  expiresAt: Date | null;
  createdAt: Date;
}

// ============================================================================
// Automated Moderation
// ============================================================================

export enum AutoModerationRule {
  PROFANITY_FILTER = 'profanity_filter',
  SPAM_DETECTION = 'spam_detection',
  LINK_DETECTION = 'link_detection',
  NSFW_IMAGE = 'nsfw_image',
  HATE_SPEECH = 'hate_speech',
  PERSONAL_INFO = 'personal_info',
  RATE_LIMIT = 'rate_limit',
}

/**
 * Automated moderation result
 */
export interface AutoModerationResult {
  passed: boolean;
  flaggedRules: AutoModerationRule[];
  confidence: Record<AutoModerationRule, number>;
  suggestedAction: 'allow' | 'flag' | 'block';
  details: Record<string, unknown>;
}

/**
 * Profanity filter configuration
 */
export interface ProfanityConfig {
  enabled: boolean;
  action: 'flag' | 'censor' | 'block';
  severity: 'mild' | 'moderate' | 'strict';
  customBlocklist: string[];
  customAllowlist: string[];
}

// ============================================================================
// Admin Dashboard
// ============================================================================

/**
 * Moderation statistics
 */
export interface ModerationStats {
  period: 'day' | 'week' | 'month';
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  reportsByReason: Record<ReportReason, number>;
  reportsByContentType: Record<ContentType, number>;
  averageResolutionTime: number; // Minutes
  actionsTaken: Record<ModerationAction, number>;
  activeModeratorCount: number;
  moderatorStats: {
    moderatorId: string;
    reviewCount: number;
    averageTime: number;
  }[];
}

/**
 * Platform health metrics for admins
 */
export interface PlatformHealthMetrics {
  activeUsers24h: number;
  newUsersToday: number;
  storiesPublishedToday: number;
  commentsToday: number;
  reportsToday: number;
  errorRate: number;
  averageResponseTime: number;
  uptime: number;
}

// ============================================================================
// DTOs
// ============================================================================

export interface CreateReportDto {
  contentType: ContentType;
  contentId: string;
  reason: ReportReason;
  description: string;
  evidence?: string[];
}

export interface ResolveModerationDto {
  action: ModerationAction;
  reason: string;
  details?: Record<string, unknown>;
  editedContent?: string; // If action is EDIT
  banDuration?: number; // Days, if action is TEMP_BAN
}

export interface IssueWarningDto {
  userId: string;
  reason: string;
  relatedContentType?: ContentType;
  relatedContentId?: string;
  expiresInDays?: number;
}

export interface IssueBanDto {
  userId: string;
  type: BanType;
  scope: BanScope;
  reason: string;
  durationDays?: number; // Required for temporary bans
  relatedReportIds?: string[];
}

export interface AppealBanDto {
  banId: string;
  appealText: string;
}

export interface ReviewAppealDto {
  approved: boolean;
  reviewNote: string;
}

/**
 * Query parameters for moderation queue
 */
export interface ModerationQueueQuery {
  page?: number;
  limit?: number;
  contentType?: ContentType;
  status?: ModerationStatus;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  source?: 'user_report' | 'auto_flagged' | 'manual_review';
  assignedTo?: string | 'unassigned';
  sortBy?: 'created' | 'priority' | 'reports';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Query parameters for user bans/warnings
 */
export interface UserModerationQuery {
  userId?: string;
  isActive?: boolean;
  type?: BanType;
  scope?: BanScope;
  issuedBy?: string;
  page?: number;
  limit?: number;
}
