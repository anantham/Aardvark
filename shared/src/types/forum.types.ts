/**
 * Forum system type definitions for Aardvark Platform
 * Handles discussion boards and community features
 */

// ============================================================================
// Enums
// ============================================================================

export enum ForumCategory {
  GENERAL = 'general',
  WRITING_TIPS = 'writing_tips',
  STORY_DISCUSSIONS = 'story_discussions',
  FEEDBACK = 'feedback',
  ANNOUNCEMENTS = 'announcements',
  HELP = 'help',
  OFF_TOPIC = 'off_topic',
}

export const FORUM_CATEGORY_LABELS: Record<ForumCategory, string> = {
  [ForumCategory.GENERAL]: 'General Discussion',
  [ForumCategory.WRITING_TIPS]: 'Writing Tips & Advice',
  [ForumCategory.STORY_DISCUSSIONS]: 'Story Discussions',
  [ForumCategory.FEEDBACK]: 'Feedback & Suggestions',
  [ForumCategory.ANNOUNCEMENTS]: 'Announcements',
  [ForumCategory.HELP]: 'Help & Support',
  [ForumCategory.OFF_TOPIC]: 'Off Topic',
};

// ============================================================================
// Thread Types
// ============================================================================

export interface ForumThread {
  id: string;
  category: ForumCategory;
  authorId: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt: Date | null;
  lastReplyUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumThreadWithAuthor extends ForumThread {
  author: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  lastReplyUser?: {
    id: string;
    username: string;
    avatarUrl: string | null;
  } | null;
}

// ============================================================================
// Post Types
// ============================================================================

export interface ForumPost {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  replyToId: string | null;
  upvotes: number;
  downvotes: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumPostWithAuthor extends ForumPost {
  author: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    reputation?: number;
  };
  userVote?: number | null; // 1, -1, or null
}

// ============================================================================
// Vote Types
// ============================================================================

export interface ForumVote {
  id: string;
  postId: string;
  userId: string;
  value: number; // 1 for upvote, -1 for downvote
  createdAt: Date;
}

// ============================================================================
// Reputation
// ============================================================================

export interface UserReputation {
  userId: string;
  score: number;
  threadsCreated: number;
  postsCreated: number;
  upvotesReceived: number;
  downvotesReceived: number;
  helpfulAnswers: number;
}

export const REPUTATION_LEVELS = [
  { min: 0, label: 'Newcomer', color: '#94a3b8' },
  { min: 10, label: 'Contributor', color: '#22c55e' },
  { min: 50, label: 'Regular', color: '#3b82f6' },
  { min: 100, label: 'Trusted', color: '#8b5cf6' },
  { min: 500, label: 'Expert', color: '#f59e0b' },
  { min: 1000, label: 'Legend', color: '#ef4444' },
];

// ============================================================================
// DTOs
// ============================================================================

export interface CreateThreadDto {
  category: ForumCategory;
  title: string;
  content: string;
}

export interface UpdateThreadDto {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

export interface CreatePostDto {
  content: string;
  replyToId?: string;
}

export interface UpdatePostDto {
  content: string;
}

export interface VotePostDto {
  value: 1 | -1;
}

export interface ThreadQueryDto {
  category?: ForumCategory;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'popular' | 'unanswered';
  search?: string;
}

export interface PostQueryDto {
  page?: number;
  limit?: number;
  sortBy?: 'oldest' | 'newest' | 'top';
}

// ============================================================================
// Responses
// ============================================================================

export interface ThreadListResponse {
  threads: ForumThreadWithAuthor[];
  total: number;
  page: number;
  limit: number;
}

export interface ThreadDetailResponse {
  thread: ForumThreadWithAuthor;
  posts: ForumPostWithAuthor[];
  totalPosts: number;
  page: number;
  limit: number;
}

export interface CategoryStats {
  category: ForumCategory;
  label: string;
  threadCount: number;
  postCount: number;
  lastActivity: Date | null;
}
