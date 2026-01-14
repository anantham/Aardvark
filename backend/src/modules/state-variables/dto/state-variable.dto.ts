import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StateValueType } from '@aardvark/shared';

export class CreateStateVariableDto {
  @ApiProperty({ description: 'Story ID' })
  @IsUUID()
  storyId: string;

  @ApiProperty({ description: 'Variable name (snake_case)', maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message: 'Name must be snake_case starting with a letter',
  })
  name: string;

  @ApiProperty({ description: 'Display name for UI', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  displayName: string;

  @ApiPropertyOptional({ description: 'Variable description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Variable type', enum: ['boolean', 'number', 'string', 'array'] })
  @IsEnum(['boolean', 'number', 'string', 'array'])
  type: StateValueType;

  @ApiProperty({ description: 'Default value' })
  defaultValue: boolean | number | string | string[];

  @ApiPropertyOptional({ description: 'Minimum value (for number type)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minValue?: number;

  @ApiPropertyOptional({ description: 'Maximum value (for number type)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxValue?: number;

  @ApiPropertyOptional({ description: 'Whether readers can see this variable', default: false })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class UpdateStateVariableDto {
  @ApiPropertyOptional({ description: 'Display name for UI', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({ description: 'Variable description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Default value' })
  @IsOptional()
  defaultValue?: boolean | number | string | string[];

  @ApiPropertyOptional({ description: 'Minimum value (for number type)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minValue?: number;

  @ApiPropertyOptional({ description: 'Maximum value (for number type)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxValue?: number;

  @ApiPropertyOptional({ description: 'Whether readers can see this variable' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class BulkCreateStateVariablesDto {
  @ApiProperty({ description: 'Story ID' })
  @IsUUID()
  storyId: string;

  @ApiProperty({ description: 'Array of variables to create', type: [CreateStateVariableDto] })
  @IsArray()
  variables: Omit<CreateStateVariableDto, 'storyId'>[];
}
