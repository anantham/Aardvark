/**
 * User-related type definitions for the Aardvark Interactive Fiction Platform
 * These types are shared between frontend and backend to ensure type safety
 */

/**
 * User roles with hierarchical permissions
 * - GUEST: Unauthenticated users with read-only access
 * - READER: Registered users who can read, save progress, and interact
 * - AUTHOR: Users who can create and manage stories
 * - MODERATOR: Users who can moderate content and handle reports
 * - ADMIN: Full system access with administrative privileges
 */
export enum UserRole {
  GUEST = 'guest',
  READER = 'reader',
  AUTHOR = 'author',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

/**
 * Subscription status for premium features
 */
export enum SubscriptionStatus {
  NONE = 'none',
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
}

/**
 * User account status for moderation purposes
 */
export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification',
  DEACTIVATED = 'deactivated',
}

/**
 * User preferences stored as JSON
 */
export interface UserPreferences {
  // Reading preferences
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  lineSpacing: 'compact' | 'normal' | 'relaxed';

  // Content preferences
  showNsfwContent: boolean;
  contentWarnings: string[];
  preferredCategories: string[];
  blockedTags: string[];

  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyNewChapters: boolean;
  notifyCommentReplies: boolean;
  notifyFollowerActivity: boolean;

  // Privacy preferences
  showReadingHistory: boolean;
  showFollowers: boolean;
  allowMessages: 'everyone' | 'followers' | 'none';

  // Accessibility
  reduceMotion: boolean;
  highContrast: boolean;
}

/**
 * Default user preferences for new accounts
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'serif',
  lineSpacing: 'normal',
  showNsfwContent: false,
  contentWarnings: [],
  preferredCategories: [],
  blockedTags: [],
  emailNotifications: true,
  pushNotifications: true,
  notifyNewChapters: true,
  notifyCommentReplies: true,
  notifyFollowerActivity: true,
  showReadingHistory: true,
  showFollowers: true,
  allowMessages: 'followers',
  reduceMotion: false,
  highContrast: false,
};

/**
 * Core user entity representing a registered account
 */
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  websiteUrl: string | null;
  socialLinks: Record<string, string>;
  role: UserRole;
  accountStatus: AccountStatus;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: Date | null;
  creditsBalance: number;
  preferences: UserPreferences;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Public user profile (safe for display to other users)
 */
export interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  websiteUrl: string | null;
  socialLinks: Record<string, string>;
  role: UserRole;
  isPremium: boolean;
  createdAt: Date;
  stats: UserStats;
  badges: UserBadge[];
}

/**
 * User statistics for profile display
 */
export interface UserStats {
  storiesPublished: number;
  storiesRead: number;
  totalReads: number;
  totalRatings: number;
  averageRating: number;
  followersCount: number;
  followingCount: number;
  commentsCount: number;
  contributedBranches: number;
}

/**
 * Achievement badges for gamification
 */
export interface UserBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

/**
 * User session data stored in JWT/Redis
 */
export interface UserSession {
  userId: string;
  username: string;
  role: UserRole;
  isPremium: boolean;
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Follow relationship between users
 */
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

/**
 * User registration DTO
 */
export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  acceptTerms: boolean;
}

/**
 * User login DTO
 */
export interface LoginUserDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Update user profile DTO
 */
export interface UpdateUserDto {
  displayName?: string;
  bio?: string;
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
  preferences?: Partial<UserPreferences>;
}

/**
 * Change password DTO
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Authentication response with tokens
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
