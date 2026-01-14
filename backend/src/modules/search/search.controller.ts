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
import { SearchStoriesDto, SearchUsersDto, AutocompleteDto } from './dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

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

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get autocomplete suggestions' })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions' })
  async autocomplete(@Query() dto: AutocompleteDto) {
    return this.searchService.autocomplete(dto);
  }

  @Post('reindex')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reindex all stories (admin only)' })
  @ApiResponse({ status: 200, description: 'Reindex completed' })
  async reindexAll() {
    // TODO: Add admin role check
    const result = await this.searchService.reindexAllStories();
    return {
      message: 'Reindex completed',
      ...result,
    };
  }
}
