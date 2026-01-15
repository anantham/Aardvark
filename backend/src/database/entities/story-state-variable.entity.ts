import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { StateValueType } from '@aardvark/shared';
import { Story } from './story.entity';

/**
 * Story state variable entity defining variables that track
 * reader decisions across a story.
 */
@Entity('story_state_variables')
export class StoryStateVariable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  storyId: string;

  @ManyToOne(() => Story, (story) => story.stateVariables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storyId' })
  story: Story;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: ['boolean', 'number', 'string', 'array'] as StateValueType[],
  })
  type: StateValueType;

  @Column({ type: 'jsonb' })
  defaultValue: boolean | number | string | string[];

  @Column({ nullable: true })
  minValue: number | null;

  @Column({ nullable: true })
  maxValue: number | null;

  @Column({ default: false })
  isVisible: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
