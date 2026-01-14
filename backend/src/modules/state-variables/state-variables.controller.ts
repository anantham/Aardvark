import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { StateVariablesService } from './state-variables.service';
import {
  CreateStateVariableDto,
  UpdateStateVariableDto,
  BulkCreateStateVariablesDto,
} from './dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('state-variables')
@Controller('state-variables')
export class StateVariablesController {
  constructor(private readonly stateVariablesService: StateVariablesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new state variable' })
  @ApiResponse({ status: 201, description: 'Variable created' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 409, description: 'Variable name already exists' })
  async create(@Body() createDto: CreateStateVariableDto, @Request() req: any) {
    return this.stateVariablesService.create(createDto, req.user.id);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk create state variables' })
  @ApiResponse({ status: 201, description: 'Variables created' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  async bulkCreate(@Body() dto: BulkCreateStateVariablesDto, @Request() req: any) {
    return this.stateVariablesService.bulkCreate(dto, req.user.id);
  }

  @Get('story/:storyId')
  @ApiOperation({ summary: 'Get all state variables for a story' })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  @ApiResponse({ status: 200, description: 'List of state variables' })
  async findByStory(@Param('storyId') storyId: string) {
    return this.stateVariablesService.findByStory(storyId);
  }

  @Get('story/:storyId/visible')
  @ApiOperation({ summary: 'Get visible state variables for a story (for readers)' })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  @ApiResponse({ status: 200, description: 'List of visible state variables' })
  async findVisibleByStory(@Param('storyId') storyId: string) {
    return this.stateVariablesService.findVisibleByStory(storyId);
  }

  @Get('story/:storyId/initial-state')
  @ApiOperation({ summary: 'Get initial state (all defaults) for a story' })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  @ApiResponse({ status: 200, description: 'Initial state object' })
  async getInitialState(@Param('storyId') storyId: string) {
    return this.stateVariablesService.getInitialState(storyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get state variable by ID' })
  @ApiParam({ name: 'id', description: 'Variable ID' })
  @ApiResponse({ status: 200, description: 'State variable details' })
  @ApiResponse({ status: 404, description: 'Variable not found' })
  async findById(@Param('id') id: string) {
    return this.stateVariablesService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a state variable' })
  @ApiParam({ name: 'id', description: 'Variable ID' })
  @ApiResponse({ status: 200, description: 'Variable updated' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Variable not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStateVariableDto,
    @Request() req: any,
  ) {
    return this.stateVariablesService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a state variable' })
  @ApiParam({ name: 'id', description: 'Variable ID' })
  @ApiResponse({ status: 204, description: 'Variable deleted' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Variable not found' })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.stateVariablesService.delete(id, req.user.id);
  }
}
