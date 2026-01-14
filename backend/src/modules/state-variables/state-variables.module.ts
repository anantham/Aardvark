import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryStateVariable, Story } from '@/database/entities';
import { StateVariablesController } from './state-variables.controller';
import { StateVariablesService } from './state-variables.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryStateVariable, Story])],
  controllers: [StateVariablesController],
  providers: [StateVariablesService],
  exports: [StateVariablesService],
})
export class StateVariablesModule {}
