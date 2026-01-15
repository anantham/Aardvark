/**
 * Tag system types for story categorization and discovery
 */

/**
 * Tag types for categorization
 */
export enum TagType {
  GENRE = 'genre',           // Fantasy, Sci-Fi, etc.
  THEME = 'theme',           // Love, Betrayal, Redemption
  MOOD = 'mood',             // Dark, Lighthearted, Suspenseful
  SETTING = 'setting',       // Medieval, Futuristic, Contemporary
  CHARACTER = 'character',   // Anti-hero, Ensemble Cast, Strong Female Lead
  TROPE = 'trope',           // Enemies to Lovers, Time Loop, Found Family
  CONTENT = 'content',       // Slow Burn, Action-heavy, Dialogue-focused
  CUSTOM = 'custom',         // User-created tags
}

/**
 * Tag interface
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: TagType;
  usageCount: number;
  isOfficial: boolean;
  isFeatured: boolean;
  parentTagId?: string;
  synonyms: string[];
  color?: string;
  iconUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Story-Tag relationship
 */
export interface StoryTag {
  storyId: string;
  tagId: string;
  addedAt: Date;
  addedByUserId?: string;
}

/**
 * Tag with usage statistics
 */
export interface TagWithStats extends Tag {
  storiesCount: number;
  weeklyGrowth: number;
  trendingScore: number;
}

/**
 * Tag group for display
 */
export interface TagGroup {
  type: TagType;
  typeName: string;
  tags: Tag[];
}

/**
 * Create tag DTO
 */
export interface CreateTagDto {
  name: string;
  description?: string;
  type: TagType;
  parentTagId?: string;
  synonyms?: string[];
  color?: string;
}

/**
 * Update tag DTO
 */
export interface UpdateTagDto {
  name?: string;
  description?: string;
  type?: TagType;
  parentTagId?: string;
  synonyms?: string[];
  color?: string;
  isFeatured?: boolean;
}

/**
 * Tag query parameters
 */
export interface TagQueryParams {
  search?: string;
  type?: TagType;
  featured?: boolean;
  official?: boolean;
  minUsage?: number;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'usage' | 'trending' | 'recent';
}

/**
 * Popular tags response
 */
export interface PopularTagsResponse {
  trending: Tag[];
  mostUsed: Tag[];
  featured: Tag[];
  byType: TagGroup[];
}

/**
 * Tag suggestion for autocomplete
 */
export interface TagSuggestion {
  id: string;
  name: string;
  slug: string;
  type: TagType;
  usageCount: number;
}
