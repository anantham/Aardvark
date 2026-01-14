import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Follow } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  exports: [TypeOrmModule],
})
export class UsersModule {}
