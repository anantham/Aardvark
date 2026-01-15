import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { CreditsService } from './credits.service';
import {
  UnlockStoryDto,
  TipAuthorDto,
  AdWatchRewardDto,
  TransactionHistoryQueryDto,
} from './dto';

/**
 * Controller for credit operations.
 * Handles balance inquiries, spending, and earning credits.
 */
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  /**
   * Get current credit balance
   * GET /credits/balance
   */
  @Get('balance')
  async getBalance(@Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    const balance = await this.creditsService.getBalance(userId);
    return {
      success: true,
      data: balance,
    };
  }

  /**
   * Get transaction history
   * GET /credits/transactions
   */
  @Get('transactions')
  async getTransactions(
    @Req() req: any,
    @Query() query: TransactionHistoryQueryDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    const result = await this.creditsService.getTransactionHistory(userId, query);
    return {
      success: true,
      data: result.transactions,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  /**
   * Get available credit bundles
   * GET /credits/bundles
   */
  @Get('bundles')
  async getBundles() {
    const bundles = await this.creditsService.getBundles();
    return {
      success: true,
      data: bundles.map((bundle) => ({
        id: bundle.id,
        name: bundle.name,
        credits: bundle.credits,
        bonusCredits: bundle.bonusCredits,
        totalCredits: bundle.credits + bundle.bonusCredits,
        priceInCents: bundle.priceInCents,
        currency: bundle.currency,
        isPopular: bundle.isPopular,
      })),
    };
  }

  /**
   * Unlock a premium story
   * POST /credits/unlock-story
   */
  @Post('unlock-story')
  async unlockStory(
    @Req() req: any,
    @Body() dto: UnlockStoryDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    const transaction = await this.creditsService.unlockStory(userId, dto);
    return {
      success: true,
      data: {
        transactionId: transaction.id,
        newBalance: transaction.balance,
      },
    };
  }

  /**
   * Tip an author
   * POST /credits/tip
   */
  @Post('tip')
  async tipAuthor(
    @Req() req: any,
    @Body() dto: TipAuthorDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    const transaction = await this.creditsService.tipAuthor(userId, dto);
    return {
      success: true,
      data: {
        transactionId: transaction.id,
        newBalance: transaction.balance,
      },
    };
  }

  /**
   * Claim daily bonus
   * POST /credits/daily-bonus
   */
  @Post('daily-bonus')
  async claimDailyBonus(@Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    const transaction = await this.creditsService.claimDailyBonus(userId);
    return {
      success: true,
      data: {
        creditsAwarded: transaction.amount,
        newBalance: transaction.balance,
      },
    };
  }

  /**
   * Reward for watching an ad
   * POST /credits/ad-reward
   */
  @Post('ad-reward')
  async rewardAdWatch(
    @Req() req: any,
    @Body() dto: AdWatchRewardDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    const transaction = await this.creditsService.rewardAdWatch(userId, dto);

    if (!transaction) {
      return {
        success: true,
        data: {
          creditsAwarded: 0,
          message: 'Ad not completed',
        },
      };
    }

    return {
      success: true,
      data: {
        creditsAwarded: transaction.amount,
        newBalance: transaction.balance,
      },
    };
  }
}
