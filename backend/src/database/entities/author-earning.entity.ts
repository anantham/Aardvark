import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { EarningType } from '@aardvark/shared';
import { User } from './user.entity';
import { Story } from './story.entity';
import { Transaction } from './transaction.entity';

/**
 * Author earning entity - tracks author revenue from story unlocks, tips, etc.
 */
@Entity('author_earnings')
export class AuthorEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column('uuid', { nullable: true })
  storyId: string | null;

  @ManyToOne(() => Story, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'storyId' })
  story: Story | null;

  @Index()
  @Column({
    type: 'enum',
    enum: EarningType,
  })
  type: EarningType;

  @Column()
  grossAmount: number;

  @Column()
  platformFee: number;

  @Column()
  netAmount: number;

  @Column('uuid', { nullable: true })
  readerUserId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'readerUserId' })
  reader: User | null;

  @Column('uuid')
  transactionId: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

/**
 * Author payout account entity - Stripe Connect account for receiving payouts
 */
@Entity('author_payout_accounts')
export class AuthorPayoutAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { unique: true })
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  stripeConnectAccountId: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  accountStatus: 'pending' | 'active' | 'restricted' | 'disabled';

  @Column({ default: false })
  chargesEnabled: boolean;

  @Column({ default: false })
  payoutsEnabled: boolean;

  @Column({ length: 2 })
  country: string;

  @Column({ length: 3, default: 'usd' })
  currency: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}

/**
 * Payout entity - tracks payout requests and status
 */
@Entity('payouts')
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  amount: number;

  @Column({ length: 3, default: 'usd' })
  currency: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ nullable: true })
  stripeTransferId: string | null;

  @Column({ nullable: true })
  stripePayoutId: string | null;

  @Column({ type: 'text', nullable: true })
  failureReason: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  requestedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  processedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;
}
