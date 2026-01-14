import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  exports: [TypeOrmModule],
})
export class RatingsModule {}
