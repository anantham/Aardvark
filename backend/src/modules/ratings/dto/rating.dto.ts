import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ description: 'Story ID' })
  @IsUUID()
  storyId: string;

  @ApiProperty({ description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Review title', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reviewTitle?: string;

  @ApiPropertyOptional({ description: 'Review text (markdown)', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  reviewText?: string;
}

export class UpdateRatingDto {
  @ApiPropertyOptional({ description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: 'Review title', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reviewTitle?: string;

  @ApiPropertyOptional({ description: 'Review text (markdown)', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  reviewText?: string;
}

export class RatingQueryDto {
  @ApiPropertyOptional({ description: 'Story ID' })
  @IsOptional()
  @IsUUID()
  storyId?: string;

  @ApiPropertyOptional({ description: 'User ID' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Only show reviews with text' })
  @IsOptional()
  @Type(() => Boolean)
  withReview?: boolean;

  @ApiPropertyOptional({ description: 'Minimum rating filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Results per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Sort by', enum: ['recent', 'helpful', 'rating_high', 'rating_low'] })
  @IsOptional()
  @IsString()
  sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low' = 'recent';
}
