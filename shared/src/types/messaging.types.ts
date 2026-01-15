/**
 * Messaging system type definitions for Aardvark Platform
 * Handles private messaging between users
 */

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  conversationId: string;
  content: string;
  isRead: boolean;
  readAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  lastMessagePreview: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
  isBlocked: boolean;
  isArchived: boolean;
  createdAt: Date;
}

export interface ConversationWithParticipant extends Conversation {
  participant: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

// ============================================================================
// DTOs
// ============================================================================

export interface SendMessageDto {
  recipientId: string;
  content: string;
}

export interface ConversationQueryDto {
  page?: number;
  limit?: number;
  archived?: boolean;
}

export interface MessageQueryDto {
  page?: number;
  limit?: number;
  before?: string; // messageId for pagination
}

export interface MarkReadDto {
  messageIds: string[];
}

// ============================================================================
// Responses
// ============================================================================

export interface ConversationListResponse {
  conversations: ConversationWithParticipant[];
  total: number;
  page: number;
  limit: number;
  unreadTotal: number;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

// ============================================================================
// User Block
// ============================================================================

export interface UserBlock {
  id: string;
  blockerId: string;
  blockedId: string;
  reason: string | null;
  createdAt: Date;
}

export interface BlockUserDto {
  userId: string;
  reason?: string;
}
