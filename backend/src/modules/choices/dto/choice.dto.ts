import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
  IsInt,
  Min,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class StateRequirementDto {
  @ApiProperty()
  @IsUUID()
  variableId: string;

  @ApiProperty()
  @IsString()
  variableName: string;

  @ApiProperty({
    enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal', 'contains', 'not_contains'],
  })
  @IsString()
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_or_equal' | 'less_or_equal' | 'contains' | 'not_contains';

  @ApiProperty()
  value: boolean | number | string;
}

class ChoiceConditionDto {
  @ApiProperty({ enum: ['state', 'visited', 'not_visited', 'custom'] })
  @IsString()
  type: 'state' | 'visited' | 'not_visited' | 'custom';

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => StateRequirementDto)
  stateRequirement?: StateRequirementDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  segmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customExpression?: string;
}

export class CreateChoiceDto {
  @ApiProperty({ description: 'Source segment ID' })
  @IsUUID()
  segmentId: string;

  @ApiProperty({ description: 'Destination segment ID' })
  @IsUUID()
  nextSegmentId: string;

  @ApiProperty({ description: 'Choice text displayed to reader', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  choiceText: string;

  @ApiPropertyOptional({ description: 'Display order (1-10)', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  order?: number;

  @ApiPropertyOptional({ description: 'Conditions for showing this choice' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceConditionDto)
  conditions?: ChoiceConditionDto[];

  @ApiPropertyOptional({ description: 'State requirements to see this choice' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StateRequirementDto)
  requiredState?: StateRequirementDto[];
}

export class UpdateChoiceDto {
  @ApiPropertyOptional({ description: 'Choice text', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  choiceText?: string;

  @ApiPropertyOptional({ description: 'Destination segment ID' })
  @IsOptional()
  @IsUUID()
  nextSegmentId?: string;

  @ApiPropertyOptional({ description: 'Display order (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  order?: number;

  @ApiPropertyOptional({ description: 'Conditions for showing this choice' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceConditionDto)
  conditions?: ChoiceConditionDto[];

  @ApiPropertyOptional({ description: 'State requirements to see this choice' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StateRequirementDto)
  requiredState?: StateRequirementDto[];

  @ApiPropertyOptional({ description: 'Hide this choice' })
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}

export class ReorderChoicesDto {
  @ApiProperty({ description: 'Array of choice IDs in new order' })
  @IsArray()
  @IsUUID('4', { each: true })
  choiceIds: string[];
}
