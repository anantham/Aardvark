/**
 * Story and branching narrative type definitions for the Aardvark Platform
 * Supports complex branching, state management, and collaborative writing
 */

/**
 * Story categories for organization and discovery
 */
export enum StoryCategory {
  FANTASY = 'fantasy',
  SCI_FI = 'sci_fi',
  ROMANCE = 'romance',
  MYSTERY = 'mystery',
  THRILLER = 'thriller',
  HORROR = 'horror',
  ADVENTURE = 'adventure',
  HISTORICAL = 'historical',
  COMEDY = 'comedy',
  DRAMA = 'drama',
  SLICE_OF_LIFE = 'slice_of_life',
  SUPERHERO = 'superhero',
  DYSTOPIAN = 'dystopian',
  URBAN_FANTASY = 'urban_fantasy',
  STEAMPUNK = 'steampunk',
  OTHER = 'other',
}

/**
 * Story collaboration modes determining who can contribute
 */
export enum CollaborationMode {
  /** Only the original author can write branches */
  PRIVATE = 'private',
  /** Other users can submit branches for author approval */
  MODERATED = 'moderated',
  /** Community can freely add branches (still subject to platform moderation) */
  OPEN = 'open',
}

/**
 * Story publication status
 */
export enum StoryStatus {
  /** Work in progress, not visible to others */
  DRAFT = 'draft',
  /** Published and visible to readers */
  PUBLISHED = 'published',
  /** Temporarily hidden by author */
  HIDDEN = 'hidden',
  /** Removed by moderation */
  REMOVED = 'removed',
  /** Story is complete and no longer updated */
  COMPLETED = 'completed',
}

/**
 * Content warning tags for mature themes
 */
export enum ContentWarning {
  VIOLENCE = 'violence',
  GORE = 'gore',
  DEATH = 'death',
  STRONG_LANGUAGE = 'strong_language',
  SUBSTANCE_USE = 'substance_use',
  MENTAL_HEALTH = 'mental_health',
  DARK_THEMES = 'dark_themes',
  SENSITIVE_TOPICS = 'sensitive_topics',
}

/**
 * Story length classification
 */
export enum StoryLength {
  SHORT = 'short', // < 10 segments
  MEDIUM = 'medium', // 10-50 segments
  LONG = 'long', // 50-200 segments
  EPIC = 'epic', // 200+ segments
}

/**
 * Story complexity rating based on branching structure
 */
export enum StoryComplexity {
  LINEAR = 'linear', // Few choices, mostly linear path
  SIMPLE = 'simple', // Some branching, converges often
  MODERATE = 'moderate', // Multiple paths with meaningful divergence
  COMPLEX = 'complex', // Heavy branching with state management
  INTRICATE = 'intricate', // Deep branching with complex conditions
}

/**
 * Core story entity
 */
export interface Story {
  id: string;
  authorId: string;
  title: string;
  description: string;
  synopsis: string; // Longer description for story page
  coverImageUrl: string | null;
  category: StoryCategory;
  tags: string[];
  contentWarnings: ContentWarning[];
  collaborationMode: CollaborationMode;
  status: StoryStatus;
  isPremium: boolean;
  creditCost: number; // 0 for free stories, 10-50 for premium
  nsfwFlag: boolean; // Future-ready, currently always false
  language: string; // ISO 639-1 code
  estimatedReadTime: number; // Minutes
  length: StoryLength;
  complexity: StoryComplexity;
  rootSegmentId: string | null; // Entry point of the story
  currentVersion: number;
  viewCount: number;
  uniqueReaders: number;
  averageRating: number;
  ratingsCount: number;
  completionRate: number; // Percentage of readers reaching an ending
  featuredAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Story segment (a single node/chapter in the branching narrative)
 */
export interface StorySegment {
  id: string;
  storyId: string;
  authorId: string; // May differ from story author in collaborative stories
  title: string | null; // Optional chapter title
  content: string; // Main narrative content (HTML from rich text editor)
  contentMarkdown: string; // Markdown source for editing

  // Visual editor positioning
  position: {
    x: number;
    y: number;
  };

  // Segment relationships
  parentSegmentIds: string[]; // Segments that can lead to this one
  isRootSegment: boolean; // Entry point of the story
  isEnding: boolean; // Marks this as a conclusion point
  endingType: 'good' | 'bad' | 'neutral' | 'secret' | null;

  // State effects - changes applied when reader reaches this segment
  stateEffects: StateEffect[];

  // Metadata
  wordCount: number;
  estimatedReadTime: number; // Seconds
  readCount: number;

  // Version control
  version: number;
  previousVersionId: string | null;

  // Collaboration
  submittedByUserId: string | null; // For moderated/open stories
  approvedByUserId: string | null;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  rejectionReason: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Choice connecting one segment to another
 */
export interface Choice {
  id: string;
  segmentId: string; // Source segment
  nextSegmentId: string; // Destination segment
  choiceText: string; // Text displayed to reader
  order: number; // Display order (1-10)

  // Conditional visibility based on reader state
  conditions: ChoiceCondition[];

  // State requirements - what the reader needs to see this choice
  requiredState: StateRequirement[];

  // Statistics
  timesChosen: number;

  isHidden: boolean; // Author can hide choices temporarily
  createdAt: Date;
  updatedAt: Date;
}

/**
 * State variable type for tracking reader decisions
 */
export type StateValueType = 'boolean' | 'number' | 'string' | 'array';

/**
 * Story state variable definition
 * Authors define these at the story level, readers accumulate values as they progress
 */
export interface StoryStateVariable {
  id: string;
  storyId: string;
  name: string; // Variable name (e.g., "met_dragon", "trust_level")
  displayName: string; // Human-readable name
  description: string;
  type: StateValueType;
  defaultValue: boolean | number | string | string[];
  minValue?: number; // For number types
  maxValue?: number; // For number types
  isVisible: boolean; // Whether readers can see this stat
  createdAt: Date;
}

/**
 * State effect applied when entering a segment
 */
export interface StateEffect {
  variableId: string;
  variableName: string;
  operation: 'set' | 'add' | 'subtract' | 'multiply' | 'append' | 'remove' | 'toggle';
  value: boolean | number | string;
}

/**
 * State requirement for conditional content
 */
export interface StateRequirement {
  variableId: string;
  variableName: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_or_equal' | 'less_or_equal' | 'contains' | 'not_contains';
  value: boolean | number | string;
}

/**
 * Condition for showing/hiding choices
 */
export interface ChoiceCondition {
  type: 'state' | 'visited' | 'not_visited' | 'custom';
  stateRequirement?: StateRequirement;
  segmentId?: string; // For visited/not_visited conditions
  customExpression?: string; // For complex conditions (future use)
}

/**
 * Reader's progress through a story
 */
export interface ReaderProgress {
  id: string;
  userId: string;
  storyId: string;
  currentSegmentId: string;

  // All segments the reader has visited
  visitedSegmentIds: string[];

  // All choices the reader has made
  choiceHistory: {
    segmentId: string;
    choiceId: string;
    timestamp: Date;
  }[];

  // Current state variables accumulated during reading
  stateVariables: Record<string, boolean | number | string | string[]>;

  // Reading statistics
  startedAt: Date;
  lastReadAt: Date;
  totalReadTime: number; // Seconds
  isCompleted: boolean;
  completedAt: Date | null;
  reachedEndingId: string | null;

  // Bookmarks within the story
  bookmarks: {
    segmentId: string;
    note: string;
    createdAt: Date;
  }[];
}

/**
 * Story version for history tracking
 */
export interface StoryVersion {
  id: string;
  storyId: string;
  version: number;
  changeDescription: string;
  changedByUserId: string;
  segmentSnapshot: Record<string, StorySegment>; // Full state at this version
  createdAt: Date;
}

/**
 * Branch submission for collaborative stories
 */
export interface BranchSubmission {
  id: string;
  storyId: string;
  parentSegmentId: string;
  submittedByUserId: string;
  segment: Partial<StorySegment>;
  choices: Partial<Choice>[];
  submissionNote: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  reviewedByUserId: string | null;
  reviewNote: string | null;
  createdAt: Date;
  reviewedAt: Date | null;
}

/**
 * Story analytics data
 */
export interface StoryAnalytics {
  storyId: string;
  period: 'day' | 'week' | 'month' | 'all_time';
  startDate: Date;
  endDate: Date;

  // Traffic metrics
  views: number;
  uniqueReaders: number;
  newReaders: number;
  returningReaders: number;

  // Engagement metrics
  averageReadTime: number;
  completionRate: number;
  bounceRate: number;

  // Branch analytics
  branchHeatmap: {
    segmentId: string;
    visits: number;
    averageTimeSpent: number;
  }[];

  choiceDistribution: {
    choiceId: string;
    segmentId: string;
    choiceText: string;
    percentage: number;
    totalChosen: number;
  }[];

  // Ending statistics
  endingDistribution: {
    segmentId: string;
    endingType: string;
    reachedCount: number;
    percentage: number;
  }[];

  // Demographics
  readersByCountry: Record<string, number>;
  readersByDevice: Record<string, number>;
}

// ============================================================================
// DTOs for API Communication
// ============================================================================

export interface CreateStoryDto {
  title: string;
  description: string;
  synopsis?: string;
  category: StoryCategory;
  tags?: string[];
  contentWarnings?: ContentWarning[];
  collaborationMode?: CollaborationMode;
  isPremium?: boolean;
  creditCost?: number;
  language?: string;
}

export interface UpdateStoryDto {
  title?: string;
  description?: string;
  synopsis?: string;
  coverImageUrl?: string;
  category?: StoryCategory;
  tags?: string[];
  contentWarnings?: ContentWarning[];
  collaborationMode?: CollaborationMode;
  status?: StoryStatus;
  isPremium?: boolean;
  creditCost?: number;
}

export interface CreateSegmentDto {
  storyId: string;
  parentSegmentId?: string; // If null, this is the root segment
  title?: string;
  content: string;
  contentMarkdown?: string;
  position?: { x: number; y: number };
  isEnding?: boolean;
  endingType?: 'good' | 'bad' | 'neutral' | 'secret';
  stateEffects?: StateEffect[];
}

export interface UpdateSegmentDto {
  title?: string;
  content?: string;
  contentMarkdown?: string;
  position?: { x: number; y: number };
  isEnding?: boolean;
  endingType?: 'good' | 'bad' | 'neutral' | 'secret' | null;
  stateEffects?: StateEffect[];
}

export interface CreateChoiceDto {
  segmentId: string;
  nextSegmentId: string;
  choiceText: string;
  order?: number;
  conditions?: ChoiceCondition[];
  requiredState?: StateRequirement[];
}

export interface UpdateChoiceDto {
  choiceText?: string;
  nextSegmentId?: string;
  order?: number;
  conditions?: ChoiceCondition[];
  requiredState?: StateRequirement[];
  isHidden?: boolean;
}

export interface SubmitBranchDto {
  storyId: string;
  parentSegmentId: string;
  segment: CreateSegmentDto;
  choices: CreateChoiceDto[];
  submissionNote: string;
}

export interface ReviewBranchDto {
  status: 'approved' | 'rejected' | 'revision_requested';
  reviewNote?: string;
}

/**
 * Query parameters for story listing
 */
export interface StoryQueryParams {
  page?: number;
  limit?: number;
  category?: StoryCategory | StoryCategory[];
  tags?: string[];
  status?: StoryStatus;
  collaborationMode?: CollaborationMode;
  isPremium?: boolean;
  authorId?: string;
  minRating?: number;
  length?: StoryLength;
  complexity?: StoryComplexity;
  language?: string;
  search?: string;
  sortBy?: 'created' | 'updated' | 'rating' | 'views' | 'trending';
  sortOrder?: 'asc' | 'desc';
  excludeWarnings?: ContentWarning[];
}
