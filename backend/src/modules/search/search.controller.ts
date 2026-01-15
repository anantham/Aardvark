import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchStoriesDto, SearchUsersDto, AutocompleteDto, SearchTagsDto, AdvancedSearchDto } from './dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole, TagType } from '@aardvark/shared';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('stories')
  @ApiOperation({ summary: 'Search stories' })
  @ApiResponse({ status: 200, description: 'Search results with pagination' })
  async searchStories(@Query() dto: SearchStoriesDto) {
    return this.searchService.searchStories(dto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({ status: 200, description: 'Search results with pagination' })
  async searchUsers(@Query() dto: SearchUsersDto) {
    return this.searchService.searchUsers(dto);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Search tags' })
  @ApiResponse({ status: 200, description: 'Tag search results with pagination' })
  async searchTags(@Query() dto: SearchTagsDto) {
    return this.searchService.searchTags(
      dto.query,
      dto.type as TagType | undefined,
      dto.limit,
      dto.page,
    );
  }

  @Get('advanced')
  @ApiOperation({ summary: 'Advanced search with tag filtering' })
  @ApiResponse({ status: 200, description: 'Advanced search results with stories and their tags' })
  async advancedSearch(@Query() dto: AdvancedSearchDto) {
    return this.searchService.advancedSearch({
      query: dto.query,
      tagIds: dto.tagIds,
      tagNames: dto.tagNames,
      matchAllTags: dto.matchAllTags,
      categories: dto.categories,
      minRating: dto.minRating,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get autocomplete suggestions' })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions' })
  async autocomplete(@Query() dto: AutocompleteDto) {
    return this.searchService.autocomplete(dto);
  }

  @Get('facets/tags')
  @ApiOperation({ summary: 'Get tag facets/aggregations' })
  @ApiResponse({ status: 200, description: 'Tag aggregations for filtering' })
  async getTagFacets() {
    return this.searchService.getTagAggregations();
  }

  @Post('reindex')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reindex all stories (admin only)' })
  @ApiResponse({ status: 200, description: 'Reindex completed' })
  async reindexAll() {
    const storiesResult = await this.searchService.reindexAllStories();
    const tagsResult = await this.searchService.reindexAllTags();
    return {
      message: 'Reindex completed',
      stories: storiesResult,
      tags: tagsResult,
    };
  }

  @Post('reindex/tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reindex all tags (admin only)' })
  @ApiResponse({ status: 200, description: 'Tags reindex completed' })
  async reindexTags() {
    const result = await this.searchService.reindexAllTags();
    return {
      message: 'Tags reindex completed',
      ...result,
    };
  }
}
