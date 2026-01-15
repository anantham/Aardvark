import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryStateVariable, Story } from '@/database/entities';
import {
  CreateStateVariableDto,
  UpdateStateVariableDto,
  BulkCreateStateVariablesDto,
} from './dto';

@Injectable()
export class StateVariablesService {
  constructor(
    @InjectRepository(StoryStateVariable)
    private readonly variableRepository: Repository<StoryStateVariable>,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}

  /**
   * Create a new state variable for a story
   */
  async create(createDto: CreateStateVariableDto, userId: string): Promise<StoryStateVariable> {
    // Verify story exists and user owns it
    const story = await this.storyRepository.findOne({
      where: { id: createDto.storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Only the story author can manage state variables');
    }

    // Check for duplicate name
    const existing = await this.variableRepository.findOne({
      where: { storyId: createDto.storyId, name: createDto.name },
    });

    if (existing) {
      throw new ConflictException(`Variable "${createDto.name}" already exists in this story`);
    }

    // Validate default value type matches declared type
    this.validateValueType(createDto.defaultValue, createDto.type);

    // Validate min/max for number type
    if (createDto.type === 'number') {
      if (createDto.minValue !== undefined && createDto.maxValue !== undefined) {
        if (createDto.minValue > createDto.maxValue) {
          throw new BadRequestException('minValue cannot be greater than maxValue');
        }
      }
      const defaultNum = createDto.defaultValue as number;
      if (createDto.minValue !== undefined && defaultNum < createDto.minValue) {
        throw new BadRequestException('defaultValue cannot be less than minValue');
      }
      if (createDto.maxValue !== undefined && defaultNum > createDto.maxValue) {
        throw new BadRequestException('defaultValue cannot be greater than maxValue');
      }
    }

    const variable = this.variableRepository.create({
      storyId: createDto.storyId,
      name: createDto.name,
      displayName: createDto.displayName,
      description: createDto.description || null,
      type: createDto.type,
      defaultValue: createDto.defaultValue,
      minValue: createDto.type === 'number' ? createDto.minValue ?? null : null,
      maxValue: createDto.type === 'number' ? createDto.maxValue ?? null : null,
      isVisible: createDto.isVisible ?? false,
    });

    return this.variableRepository.save(variable);
  }

  /**
   * Bulk create state variables for a story
   */
  async bulkCreate(
    dto: BulkCreateStateVariablesDto,
    userId: string,
  ): Promise<StoryStateVariable[]> {
    // Verify story exists and user owns it
    const story = await this.storyRepository.findOne({
      where: { id: dto.storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Only the story author can manage state variables');
    }

    // Check for duplicate names within the request
    const names = dto.variables.map((v) => v.name);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      throw new BadRequestException('Duplicate variable names in request');
    }

    // Check for existing names
    const existingVars = await this.variableRepository.find({
      where: { storyId: dto.storyId },
    });
    const existingNames = new Set(existingVars.map((v) => v.name));

    for (const name of names) {
      if (existingNames.has(name)) {
        throw new ConflictException(`Variable "${name}" already exists in this story`);
      }
    }

    // Create all variables
    const variables = dto.variables.map((v) => {
      this.validateValueType(v.defaultValue, v.type);

      return this.variableRepository.create({
        storyId: dto.storyId,
        name: v.name,
        displayName: v.displayName,
        description: v.description || null,
        type: v.type,
        defaultValue: v.defaultValue,
        minValue: v.type === 'number' ? v.minValue ?? null : null,
        maxValue: v.type === 'number' ? v.maxValue ?? null : null,
        isVisible: v.isVisible ?? false,
      });
    });

    return this.variableRepository.save(variables);
  }

  /**
   * Get all state variables for a story
   */
  async findByStory(storyId: string): Promise<StoryStateVariable[]> {
    return this.variableRepository.find({
      where: { storyId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Get visible state variables for a story (for readers)
   */
  async findVisibleByStory(storyId: string): Promise<StoryStateVariable[]> {
    return this.variableRepository.find({
      where: { storyId, isVisible: true },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Get a state variable by ID
   */
  async findById(id: string): Promise<StoryStateVariable> {
    const variable = await this.variableRepository.findOne({
      where: { id },
      relations: ['story'],
    });

    if (!variable) {
      throw new NotFoundException('State variable not found');
    }

    return variable;
  }

  /**
   * Get a state variable by name within a story
   */
  async findByName(storyId: string, name: string): Promise<StoryStateVariable | null> {
    return this.variableRepository.findOne({
      where: { storyId, name },
    });
  }

  /**
   * Update a state variable
   */
  async update(
    id: string,
    updateDto: UpdateStateVariableDto,
    userId: string,
  ): Promise<StoryStateVariable> {
    const variable = await this.findById(id);

    // Verify ownership
    const story = await this.storyRepository.findOne({
      where: { id: variable.storyId },
    });

    if (!story || story.authorId !== userId) {
      throw new ForbiddenException('Only the story author can manage state variables');
    }

    // Validate default value if provided
    if (updateDto.defaultValue !== undefined) {
      this.validateValueType(updateDto.defaultValue, variable.type);

      if (variable.type === 'number') {
        const defaultNum = updateDto.defaultValue as number;
        const minVal = updateDto.minValue ?? variable.minValue;
        const maxVal = updateDto.maxValue ?? variable.maxValue;

        if (minVal !== null && defaultNum < minVal) {
          throw new BadRequestException('defaultValue cannot be less than minValue');
        }
        if (maxVal !== null && defaultNum > maxVal) {
          throw new BadRequestException('defaultValue cannot be greater than maxValue');
        }
      }
    }

    // Validate min/max
    if (variable.type === 'number') {
      const minVal = updateDto.minValue ?? variable.minValue;
      const maxVal = updateDto.maxValue ?? variable.maxValue;

      if (minVal !== null && maxVal !== null && minVal > maxVal) {
        throw new BadRequestException('minValue cannot be greater than maxValue');
      }
    }

    Object.assign(variable, updateDto);
    return this.variableRepository.save(variable);
  }

  /**
   * Delete a state variable
   */
  async delete(id: string, userId: string): Promise<void> {
    const variable = await this.findById(id);

    // Verify ownership
    const story = await this.storyRepository.findOne({
      where: { id: variable.storyId },
    });

    if (!story || story.authorId !== userId) {
      throw new ForbiddenException('Only the story author can manage state variables');
    }

    await this.variableRepository.remove(variable);
  }

  /**
   * Get initial state for a story (all variables with default values)
   */
  async getInitialState(
    storyId: string,
  ): Promise<Record<string, boolean | number | string | string[]>> {
    const variables = await this.findByStory(storyId);

    const state: Record<string, boolean | number | string | string[]> = {};
    for (const variable of variables) {
      state[variable.name] = variable.defaultValue;
    }

    return state;
  }

  /**
   * Validate that a value matches the expected type
   */
  private validateValueType(
    value: boolean | number | string | string[],
    type: string,
  ): void {
    switch (type) {
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new BadRequestException('Value must be a boolean');
        }
        break;
      case 'number':
        if (typeof value !== 'number') {
          throw new BadRequestException('Value must be a number');
        }
        break;
      case 'string':
        if (typeof value !== 'string') {
          throw new BadRequestException('Value must be a string');
        }
        break;
      case 'array':
        if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
          throw new BadRequestException('Value must be an array of strings');
        }
        break;
      default:
        throw new BadRequestException(`Invalid type: ${type}`);
    }
  }
}
