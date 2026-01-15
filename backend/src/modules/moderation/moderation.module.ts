import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';
import {
  Report,
  ModerationLog,
  UserWarning,
  UserBan,
  ContentFlag,
  User,
} from '@/database/entities';

/**
 * Moderation module providing content moderation, user reports,
 * warnings, bans, and admin tools for platform safety.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      ModerationLog,
      UserWarning,
      UserBan,
      ContentFlag,
      User,
    ]),
  ],
  controllers: [ModerationController],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
