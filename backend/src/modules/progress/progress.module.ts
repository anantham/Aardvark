import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReaderProgress } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ReaderProgress])],
  exports: [TypeOrmModule],
})
export class ProgressModule {}
