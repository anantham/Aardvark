import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorySegment } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([StorySegment])],
  exports: [TypeOrmModule],
})
export class SegmentsModule {}
