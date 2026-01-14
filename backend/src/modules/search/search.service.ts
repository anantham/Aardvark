import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '@elastic/elasticsearch';
import { Story, User } from '@/database/entities';
import { SearchStoriesDto, SearchUsersDto, AutocompleteDto } from './dto';
import { StoryStatus } from '@aardvark/shared';

const STORIES_INDEX = 'aardvark_stories';
const USERS_INDEX = 'aardvark_users';

interface StoryDocument {
  id: string;
  title: string;
  description: string;
  synopsis: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  category: string;
  tags: string[];
  contentWarnings: string[];
  collaborationMode: string;
  isPremium: boolean;
  language: string;
  length: string;
  complexity: string;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  publishedAt: Date;
  updatedAt: Date;
  suggest: {
    input: string[];
    weight: number;
  };
}

interface UserDocument {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  role: string;
  storiesCount: number;
  followersCount: number;
  suggest: {
    input: string[];
    weight: number;
  };
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: Client;
  private isConnected = false;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    try {
      const esConfig = this.configService.get('elasticsearch');

      this.client = new Client({
        node: esConfig.node,
        auth: esConfig.username ? {
          username: esConfig.username,
          password: esConfig.password,
        } : undefined,
      });

      // Test connection
      await this.client.ping();
      this.isConnected = true;
      this.logger.log('Connected to Elasticsearch');

      // Initialize indices
      await this.initializeIndices();
    } catch (error) {
      this.logger.warn('Failed to connect to Elasticsearch, search features will be limited', error.message);
    }
  }

  /**
   * Initialize Elasticsearch indices with mappings
   */
  private async initializeIndices() {
    // Stories index
    const storiesExists = await this.client.indices.exists({ index: STORIES_INDEX });
    if (!storiesExists) {
      await this.client.indices.create({
        index: STORIES_INDEX,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
            analysis: {
              analyzer: {
                story_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding', 'porter_stem'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { type: 'text', analyzer: 'story_analyzer', fields: { keyword: { type: 'keyword' } } },
              description: { type: 'text', analyzer: 'story_analyzer' },
              synopsis: { type: 'text', analyzer: 'story_analyzer' },
              authorId: { type: 'keyword' },
              authorUsername: { type: 'keyword' },
              authorDisplayName: { type: 'text' },
              category: { type: 'keyword' },
              tags: { type: 'keyword' },
              contentWarnings: { type: 'keyword' },
              collaborationMode: { type: 'keyword' },
              isPremium: { type: 'boolean' },
              language: { type: 'keyword' },
              length: { type: 'keyword' },
              complexity: { type: 'keyword' },
              viewCount: { type: 'integer' },
              averageRating: { type: 'float' },
              ratingCount: { type: 'integer' },
              publishedAt: { type: 'date' },
              updatedAt: { type: 'date' },
              suggest: { type: 'completion', analyzer: 'simple' },
            },
          },
        },
      });
      this.logger.log('Created stories index');
    }

    // Users index
    const usersExists = await this.client.indices.exists({ index: USERS_INDEX });
    if (!usersExists) {
      await this.client.indices.create({
        index: USERS_INDEX,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              username: { type: 'text', fields: { keyword: { type: 'keyword' } } },
              displayName: { type: 'text' },
              bio: { type: 'text' },
              role: { type: 'keyword' },
              storiesCount: { type: 'integer' },
              followersCount: { type: 'integer' },
              suggest: { type: 'completion', analyzer: 'simple' },
            },
          },
        },
      });
      this.logger.log('Created users index');
    }
  }

  /**
   * Search stories
   */
  async searchStories(dto: SearchStoriesDto) {
    if (!this.isConnected) {
      return this.fallbackSearchStories(dto);
    }

    const { query, page = 1, limit = 20 } = dto;
    const from = (page - 1) * limit;

    // Build query
    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['title^3', 'description^2', 'synopsis', 'tags^2', 'authorUsername', 'authorDisplayName'],
          fuzziness: 'AUTO',
        },
      },
    ];

    const filter: any[] = [];

    if (dto.categories?.length) {
      filter.push({ terms: { category: dto.categories } });
    }

    if (dto.tags?.length) {
      filter.push({ terms: { tags: dto.tags } });
    }

    if (dto.excludeWarnings?.length) {
      filter.push({
        bool: {
          must_not: { terms: { contentWarnings: dto.excludeWarnings } },
        },
      });
    }

    if (dto.length) {
      filter.push({ term: { length: dto.length } });
    }

    if (dto.complexity) {
      filter.push({ term: { complexity: dto.complexity } });
    }

    if (dto.minRating !== undefined) {
      filter.push({ range: { averageRating: { gte: dto.minRating } } });
    }

    if (dto.freeOnly) {
      filter.push({ term: { isPremium: false } });
    }

    if (dto.authorId) {
      filter.push({ term: { authorId: dto.authorId } });
    }

    if (dto.language) {
      filter.push({ term: { language: dto.language } });
    }

    // Build sort
    let sort: any[] = [];
    switch (dto.sortBy) {
      case 'rating':
        sort = [{ averageRating: 'desc' }, { ratingCount: 'desc' }];
        break;
      case 'views':
        sort = [{ viewCount: 'desc' }];
        break;
      case 'recent':
        sort = [{ publishedAt: 'desc' }];
        break;
      case 'trending':
        // Simple trending: combine views and recency
        sort = [
          { _score: 'desc' },
          { viewCount: 'desc' },
          { publishedAt: 'desc' },
        ];
        break;
      case 'relevance':
      default:
        sort = [{ _score: 'desc' }];
    }

    try {
      const result = await this.client.search({
        index: STORIES_INDEX,
        body: {
          from,
          size: limit,
          query: {
            bool: {
              must,
              filter,
            },
          },
          sort,
        },
      });

      const hits = result.hits.hits as any[];
      const total = typeof result.hits.total === 'number'
        ? result.hits.total
        : result.hits.total?.value || 0;

      return {
        data: hits.map((hit) => ({
          ...hit._source,
          score: hit._score,
        })),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Elasticsearch search failed', error);
      return this.fallbackSearchStories(dto);
    }
  }

  /**
   * Search users
   */
  async searchUsers(dto: SearchUsersDto) {
    if (!this.isConnected) {
      return this.fallbackSearchUsers(dto);
    }

    const { query, page = 1, limit = 20 } = dto;
    const from = (page - 1) * limit;

    try {
      const result = await this.client.search({
        index: USERS_INDEX,
        body: {
          from,
          size: limit,
          query: {
            multi_match: {
              query,
              fields: ['username^3', 'displayName^2', 'bio'],
              fuzziness: 'AUTO',
            },
          },
          sort: [{ _score: 'desc' }, { followersCount: 'desc' }],
        },
      });

      const hits = result.hits.hits as any[];
      const total = typeof result.hits.total === 'number'
        ? result.hits.total
        : result.hits.total?.value || 0;

      return {
        data: hits.map((hit) => hit._source),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Elasticsearch user search failed', error);
      return this.fallbackSearchUsers(dto);
    }
  }

  /**
   * Autocomplete suggestions
   */
  async autocomplete(dto: AutocompleteDto) {
    if (!this.isConnected) {
      return { suggestions: [] };
    }

    const index = dto.type === 'user' ? USERS_INDEX : STORIES_INDEX;

    try {
      const result = await this.client.search({
        index,
        body: {
          suggest: {
            story_suggest: {
              prefix: dto.prefix,
              completion: {
                field: 'suggest',
                size: dto.limit,
                fuzzy: {
                  fuzziness: 'AUTO',
                },
              },
            },
          },
        },
      });

      const suggestions = (result.suggest as any)?.story_suggest?.[0]?.options || [];

      return {
        suggestions: suggestions.map((s: any) => ({
          text: s.text,
          id: s._source.id,
          ...(dto.type === 'story' && { category: s._source.category }),
          ...(dto.type === 'user' && { username: s._source.username }),
        })),
      };
    } catch (error) {
      this.logger.error('Autocomplete failed', error);
      return { suggestions: [] };
    }
  }

  /**
   * Index a story
   */
  async indexStory(story: Story & { author?: User }): Promise<void> {
    if (!this.isConnected) return;

    const doc: StoryDocument = {
      id: story.id,
      title: story.title,
      description: story.description,
      synopsis: story.synopsis || '',
      authorId: story.authorId,
      authorUsername: story.author?.username || '',
      authorDisplayName: story.author?.displayName || story.author?.username || '',
      category: story.category,
      tags: story.tags,
      contentWarnings: story.contentWarnings,
      collaborationMode: story.collaborationMode,
      isPremium: story.isPremium,
      language: story.language,
      length: story.length,
      complexity: story.complexity,
      viewCount: story.viewCount,
      averageRating: story.averageRating,
      ratingCount: story.ratingCount,
      publishedAt: story.publishedAt,
      updatedAt: story.updatedAt,
      suggest: {
        input: [story.title, ...story.tags],
        weight: Math.round(story.averageRating * story.ratingCount),
      },
    };

    try {
      await this.client.index({
        index: STORIES_INDEX,
        id: story.id,
        body: doc,
        refresh: true,
      });
    } catch (error) {
      this.logger.error(`Failed to index story ${story.id}`, error);
    }
  }

  /**
   * Remove a story from index
   */
  async removeStory(storyId: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.client.delete({
        index: STORIES_INDEX,
        id: storyId,
        refresh: true,
      });
    } catch (error) {
      this.logger.error(`Failed to remove story ${storyId} from index`, error);
    }
  }

  /**
   * Index a user
   */
  async indexUser(user: User, storiesCount: number, followersCount: number): Promise<void> {
    if (!this.isConnected) return;

    const doc: UserDocument = {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      bio: user.bio || '',
      role: user.role,
      storiesCount,
      followersCount,
      suggest: {
        input: [user.username, user.displayName].filter(Boolean) as string[],
        weight: followersCount,
      },
    };

    try {
      await this.client.index({
        index: USERS_INDEX,
        id: user.id,
        body: doc,
        refresh: true,
      });
    } catch (error) {
      this.logger.error(`Failed to index user ${user.id}`, error);
    }
  }

  /**
   * Reindex all stories (admin function)
   */
  async reindexAllStories(): Promise<{ indexed: number; failed: number }> {
    if (!this.isConnected) {
      return { indexed: 0, failed: 0 };
    }

    const stories = await this.storyRepository.find({
      where: { status: StoryStatus.PUBLISHED },
      relations: ['author'],
    });

    let indexed = 0;
    let failed = 0;

    for (const story of stories) {
      try {
        await this.indexStory(story);
        indexed++;
      } catch {
        failed++;
      }
    }

    return { indexed, failed };
  }

  // ============================================================================
  // Fallback Methods (when Elasticsearch is unavailable)
  // ============================================================================

  private async fallbackSearchStories(dto: SearchStoriesDto) {
    const { query, page = 1, limit = 20 } = dto;

    const queryBuilder = this.storyRepository
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.author', 'author')
      .where('story.status = :status', { status: StoryStatus.PUBLISHED })
      .andWhere(
        '(story.title ILIKE :query OR story.description ILIKE :query OR story.tags::text ILIKE :query)',
        { query: `%${query}%` },
      );

    if (dto.categories?.length) {
      queryBuilder.andWhere('story.category IN (:...categories)', { categories: dto.categories });
    }

    if (dto.minRating !== undefined) {
      queryBuilder.andWhere('story.averageRating >= :minRating', { minRating: dto.minRating });
    }

    if (dto.freeOnly) {
      queryBuilder.andWhere('story.isPremium = false');
    }

    if (dto.authorId) {
      queryBuilder.andWhere('story.authorId = :authorId', { authorId: dto.authorId });
    }

    const skip = (page - 1) * limit;
    const [stories, total] = await queryBuilder
      .orderBy('story.averageRating', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: stories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async fallbackSearchUsers(dto: SearchUsersDto) {
    const { query, page = 1, limit = 20 } = dto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.accountStatus = :status', { status: 'active' })
      .andWhere(
        '(user.username ILIKE :query OR user.displayName ILIKE :query)',
        { query: `%${query}%` },
      );

    const skip = (page - 1) * limit;
    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: users.map((u) => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        role: u.role,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
