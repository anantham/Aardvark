/**
 * Shared constants for Aardvark Platform
 */

// ============================================================================
// Application Configuration
// ============================================================================

export const APP_NAME = 'Aardvark';
export const APP_DESCRIPTION = 'Interactive Fiction Platform - Choose Your Own Adventure';
export const APP_VERSION = '1.0.0';

// ============================================================================
// Pagination Defaults
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

// ============================================================================
// Authentication Constants
// ============================================================================

export const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
export const PASSWORD_RESET_TOKEN_EXPIRY = '1h'; // 1 hour
export const EMAIL_VERIFICATION_TOKEN_EXPIRY = '24h'; // 24 hours

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;

// ============================================================================
// Content Limits
// ============================================================================

export const MAX_STORY_TITLE_LENGTH = 200;
export const MAX_STORY_DESCRIPTION_LENGTH = 1000;
export const MAX_STORY_SYNOPSIS_LENGTH = 5000;
export const MAX_SEGMENT_CONTENT_LENGTH = 50000; // ~10,000 words
export const MAX_CHOICE_TEXT_LENGTH = 500;
export const MAX_CHOICES_PER_SEGMENT = 10;
export const MIN_CHOICES_PER_SEGMENT = 1;

export const MAX_COMMENT_LENGTH = 5000;
export const MAX_REVIEW_LENGTH = 10000;
export const MAX_BIO_LENGTH = 500;
export const MAX_MESSAGE_LENGTH = 10000;
export const MAX_FORUM_POST_LENGTH = 20000;

export const MAX_TAGS_PER_STORY = 20;
export const MAX_TAG_LENGTH = 50;

// ============================================================================
// File Upload Limits
// ============================================================================

export const MAX_AVATAR_SIZE_MB = 5;
export const MAX_COVER_IMAGE_SIZE_MB = 10;
export const MAX_STORY_IMAGE_SIZE_MB = 10;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

// ============================================================================
// Rate Limiting
// ============================================================================

export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

export const AD_WATCH_COOLDOWN_SECONDS = 600; // 10 minutes
export const MAX_ADS_PER_DAY = 50;
export const MAX_REVIEW_REWARDS_PER_DAY = 5;

// ============================================================================
// Credit System
// ============================================================================

export const CREDITS_PER_AD_WATCH = 1;
export const CREDITS_DAILY_BONUS = 2;
export const CREDITS_STORY_COMPLETION = 5;
export const CREDITS_PER_REVIEW = 1;
export const CREDITS_REFERRAL_BONUS = 10;

export const AI_COMPANION_COST = 5; // For non-premium users
export const MIN_STORY_CREDIT_COST = 10;
export const MAX_STORY_CREDIT_COST = 50;
export const DEFAULT_STORY_CREDIT_COST = 20;

// ============================================================================
// Subscription Pricing (in cents)
// ============================================================================

export const PREMIUM_MONTHLY_PRICE_CENTS = 999; // $9.99
export const PREMIUM_YEARLY_PRICE_CENTS = 9999; // $99.99 (2 months free)

// Credit bundle pricing
export const CREDIT_BUNDLE_STARTER_PRICE_CENTS = 499; // 100 credits
export const CREDIT_BUNDLE_POPULAR_PRICE_CENTS = 1999; // 500 credits + 50 bonus
export const CREDIT_BUNDLE_VALUE_PRICE_CENTS = 3499; // 1000 credits + 150 bonus

// ============================================================================
// Author Earnings
// ============================================================================

export const PLATFORM_FEE_PERCENTAGE = 30; // 30%
export const AUTHOR_SHARE_PERCENTAGE = 70; // 70%
export const MIN_PAYOUT_AMOUNT_CENTS = 5000; // $50

// ============================================================================
// Rating System
// ============================================================================

export const MIN_RATING = 0.5;
export const MAX_RATING = 5;
export const RATING_INCREMENT = 0.5;

// ============================================================================
// Reading Progress
// ============================================================================

export const AUTO_SAVE_INTERVAL_MS = 30000; // 30 seconds
export const READING_SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// ============================================================================
// Search Configuration
// ============================================================================

export const MIN_SEARCH_QUERY_LENGTH = 2;
export const MAX_SEARCH_QUERY_LENGTH = 200;
export const MAX_SEARCH_RESULTS = 1000;
export const SEARCH_DEBOUNCE_MS = 300;

// ============================================================================
// Story State Variables
// ============================================================================

export const MAX_STATE_VARIABLES_PER_STORY = 50;
export const MAX_STATE_VARIABLE_NAME_LENGTH = 50;
export const MAX_STATE_EFFECTS_PER_SEGMENT = 10;
export const MAX_CONDITIONS_PER_CHOICE = 5;

// ============================================================================
// Moderation
// ============================================================================

export const STRIKES_FOR_TEMP_BAN = 3;
export const DEFAULT_TEMP_BAN_DAYS = 7;
export const WARNING_EXPIRY_DAYS = 90;
export const STRIKE_EXPIRY_DAYS = 180;

export const MAX_REPORTS_BEFORE_AUTO_HIDE = 5;
export const REPORT_COOLDOWN_HOURS = 24; // Same user, same content

// ============================================================================
// Collaboration
// ============================================================================

export const MAX_PENDING_BRANCH_SUBMISSIONS = 10; // Per user, per story
export const BRANCH_REVIEW_EXPIRY_DAYS = 30;

// ============================================================================
// Notifications
// ============================================================================

export const MAX_NOTIFICATIONS_PER_FETCH = 50;
export const NOTIFICATION_RETENTION_DAYS = 90;

// ============================================================================
// Forum
// ============================================================================

export const MAX_THREAD_TITLE_LENGTH = 200;
export const MAX_THREADS_PER_DAY = 5;
export const MAX_POSTS_PER_DAY = 50;
export const FORUM_EDIT_WINDOW_MINUTES = 30;

// ============================================================================
// Caching
// ============================================================================

export const CACHE_TTL_SECONDS = {
  STORY_DETAILS: 300, // 5 minutes
  STORY_LIST: 60, // 1 minute
  USER_PROFILE: 300, // 5 minutes
  TRENDING: 600, // 10 minutes
  SEARCH_RESULTS: 120, // 2 minutes
  LEADERBOARD: 900, // 15 minutes
};

// ============================================================================
// URLs and Routes
// ============================================================================

export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STORIES: '/stories',
  STORY: '/story/:id',
  READ: '/read/:storyId/:segmentId',
  CREATE_STORY: '/create',
  EDIT_STORY: '/edit/:id',
  PROFILE: '/user/:username',
  SETTINGS: '/settings',
  PREMIUM: '/premium',
  SEARCH: '/search',
  DISCOVER: '/discover',
  FORUM: '/forum',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  MODERATION: '/moderation',
  ADMIN: '/admin',
} as const;

// ============================================================================
// SEO
// ============================================================================

export const SEO_DEFAULTS = {
  TITLE_SUFFIX: ' | Aardvark',
  OG_IMAGE: '/og-image.png',
  TWITTER_HANDLE: '@aardvark',
};

// ============================================================================
// Feature Flags (Environment-based defaults)
// ============================================================================

export const FEATURE_FLAGS = {
  NSFW_CONTENT: false,
  AI_COMPANION: true,
  PREMIUM_SUBSCRIPTIONS: true,
  AD_REWARDS: true,
  FORUM: true,
  MESSAGING: true,
  BRANCH_CONTRIBUTIONS: true,
} as const;
