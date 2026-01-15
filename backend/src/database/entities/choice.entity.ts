import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { ChoiceCondition, StateRequirement } from '@aardvark/shared';
import { StorySegment } from './story-segment.entity';

/**
 * Choice entity representing a decision point that connects
 * one story segment to another.
 */
@Entity('choices')
export class Choice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  segmentId: string;

  @ManyToOne(() => StorySegment, (segment) => segment.choices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'segmentId' })
  segment: StorySegment;

  @Index()
  @Column('uuid')
  nextSegmentId: string;

  @ManyToOne(() => StorySegment, (segment) => segment.incomingChoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nextSegmentId' })
  nextSegment: StorySegment;

  @Column({ length: 500 })
  choiceText: string;

  @Column({ default: 1 })
  order: number;

  // Conditional visibility based on reader state
  @Column({ type: 'jsonb', default: [] })
  conditions: ChoiceCondition[];

  // State requirements to see this choice
  @Column({ type: 'jsonb', default: [] })
  requiredState: StateRequirement[];

  // Statistics
  @Column({ default: 0 })
  timesChosen: number;

  @Column({ default: false })
  isHidden: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
