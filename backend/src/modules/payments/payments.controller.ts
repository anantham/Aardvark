import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  Headers,
  RawBodyRequest,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay.service';
import {
  CreateCreditCheckoutDto,
  CreateSubscriptionCheckoutDto,
  CreateSetupIntentDto,
  CreateConnectAccountDto,
  CancelSubscriptionDto,
  CreateUPIOrderDto,
  VerifyUPIPaymentDto,
  SetupUPIPayoutAccountDto,
  RequestUPIPayoutDto,
} from './dto';

/**
 * Controller for payment operations.
 * Handles checkout sessions, subscriptions, and webhooks.
 */
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly razorpayService: RazorpayService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create checkout session for credit bundle purchase
   * POST /payments/checkout/credits
   */
  @Post('checkout/credits')
  async createCreditCheckout(
    @Req() req: any,
    @Body() dto: CreateCreditCheckoutDto,
  ) {
    // TODO: Get user from JWT
    const userId = req.user?.id || 'mock-user-id';
    const email = req.user?.email || 'user@example.com';

    // Get or create Stripe customer
    const customer = await this.paymentsService.getOrCreateCustomer(userId, email);

    // TODO: Get bundle details from database
    const mockPriceId = 'price_mock_credits';

    const session = await this.paymentsService.createCreditCheckoutSession(
      customer.id,
      mockPriceId,
      userId,
      dto.bundleId,
      dto.successUrl,
      dto.cancelUrl,
    );

    return {
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    };
  }

  /**
   * Create checkout session for subscription
   * POST /payments/checkout/subscription
   */
  @Post('checkout/subscription')
  async createSubscriptionCheckout(
    @Req() req: any,
    @Body() dto: CreateSubscriptionCheckoutDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    const email = req.user?.email || 'user@example.com';

    const customer = await this.paymentsService.getOrCreateCustomer(userId, email);

    // TODO: Get plan details from database
    const mockPriceId = 'price_mock_subscription';

    const session = await this.paymentsService.createSubscriptionCheckoutSession(
      customer.id,
      mockPriceId,
      userId,
      dto.planId,
      dto.successUrl,
      dto.cancelUrl,
    );

    return {
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    };
  }

  /**
   * Create setup intent for saving payment methods
   * POST /payments/setup-intent
   */
  @Post('setup-intent')
  async createSetupIntent(
    @Req() req: any,
    @Body() dto: CreateSetupIntentDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    const email = req.user?.email || 'user@example.com';

    const customer = await this.paymentsService.getOrCreateCustomer(userId, email);
    const setupIntent = await this.paymentsService.createSetupIntent(customer.id);

    return {
      success: true,
      data: {
        clientSecret: setupIntent.client_secret,
      },
    };
  }

  /**
   * Get user's payment methods
   * GET /payments/payment-methods
   */
  @Get('payment-methods')
  async listPaymentMethods(@Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    const email = req.user?.email || 'user@example.com';

    const customer = await this.paymentsService.getOrCreateCustomer(userId, email);
    const paymentMethods = await this.paymentsService.listPaymentMethods(customer.id);

    return {
      success: true,
      data: paymentMethods.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: pm.card
          ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              expMonth: pm.card.exp_month,
              expYear: pm.card.exp_year,
            }
          : null,
      })),
    };
  }

  /**
   * Remove a payment method
   * DELETE /payments/payment-methods/:id
   */
  @Delete('payment-methods/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePaymentMethod(@Param('id') paymentMethodId: string) {
    await this.paymentsService.detachPaymentMethod(paymentMethodId);
  }

  /**
   * Cancel current subscription
   * POST /payments/subscription/cancel
   */
  @Post('subscription/cancel')
  async cancelSubscription(
    @Req() req: any,
    @Body() dto: CancelSubscriptionDto,
  ) {
    // TODO: Get user's subscription from database
    const mockSubscriptionId = 'sub_mock';

    const subscription = await this.paymentsService.cancelSubscription(
      mockSubscriptionId,
      dto.cancelImmediately,
    );

    return {
      success: true,
      data: {
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    };
  }

  /**
   * Resume canceled subscription
   * POST /payments/subscription/resume
   */
  @Post('subscription/resume')
  async resumeSubscription(@Req() req: any) {
    // TODO: Get user's subscription from database
    const mockSubscriptionId = 'sub_mock';

    const subscription = await this.paymentsService.resumeSubscription(mockSubscriptionId);

    return {
      success: true,
      data: {
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    };
  }

  // ============================================================================
  // Connect (Author Payouts)
  // ============================================================================

  /**
   * Create a Stripe Connect account for author payouts
   * POST /payments/connect/account
   */
  @Post('connect/account')
  async createConnectAccount(
    @Req() req: any,
    @Body() dto: CreateConnectAccountDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    const email = req.user?.email || 'author@example.com';

    const account = await this.paymentsService.createConnectAccount(
      userId,
      email,
      dto.country,
      dto.businessType,
    );

    const accountLink = await this.paymentsService.createConnectAccountLink(
      account.id,
      dto.refreshUrl,
      dto.returnUrl,
    );

    return {
      success: true,
      data: {
        accountId: account.id,
        onboardingUrl: accountLink.url,
      },
    };
  }

  /**
   * Get onboarding link for existing Connect account
   * POST /payments/connect/onboarding-link
   */
  @Post('connect/onboarding-link')
  async getConnectOnboardingLink(
    @Req() req: any,
    @Body() body: { returnUrl: string; refreshUrl: string },
  ) {
    // TODO: Get user's Connect account ID from database
    const mockAccountId = 'acct_mock';

    const accountLink = await this.paymentsService.createConnectAccountLink(
      mockAccountId,
      body.refreshUrl,
      body.returnUrl,
    );

    return {
      success: true,
      data: {
        url: accountLink.url,
      },
    };
  }

  /**
   * Get Connect account status
   * GET /payments/connect/status
   */
  @Get('connect/status')
  async getConnectStatus(@Req() req: any) {
    // TODO: Get user's Connect account ID from database
    const mockAccountId = 'acct_mock';

    try {
      const account = await this.paymentsService.getConnectAccount(mockAccountId);

      return {
        success: true,
        data: {
          accountId: account.id,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          detailsSubmitted: account.details_submitted,
          requirements: account.requirements,
        },
      };
    } catch {
      return {
        success: true,
        data: null,
      };
    }
  }

  // ============================================================================
  // Webhooks
  // ============================================================================

  /**
   * Handle Stripe webhooks
   * POST /payments/webhook
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return { received: true };
    }

    const event = this.paymentsService.constructWebhookEvent(
      req.rawBody!,
      signature,
      webhookSecret,
    );

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        // TODO: Process payment, add credits or activate subscription
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Handle subscription changes
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        // TODO: Update subscription status in database
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const canceledSub = event.data.object;
        console.log('Subscription canceled:', canceledSub.id);
        // TODO: Update subscription status in database
        break;

      case 'invoice.payment_succeeded':
        // Handle successful payment
        const invoice = event.data.object;
        console.log('Payment succeeded:', invoice.id);
        // TODO: Process subscription renewal
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object;
        console.log('Payment failed:', failedInvoice.id);
        // TODO: Notify user, handle grace period
        break;

      case 'account.updated':
        // Handle Connect account updates
        const account = event.data.object;
        console.log('Connect account updated:', account.id);
        // TODO: Update author payout account status
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  // ============================================================================
  // UPI Payments (India - Razorpay)
  // ============================================================================

  /**
   * Create UPI payment order for credit bundle purchase
   * POST /payments/upi/order
   */
  @Post('upi/order')
  async createUPIOrder(
    @Req() req: any,
    @Body() dto: CreateUPIOrderDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';

    const { order, razorpayKeyId } = await this.razorpayService.createOrder(
      userId,
      dto.bundleId,
    );

    return {
      success: true,
      data: {
        orderId: order.id,
        razorpayOrderId: order.razorpayOrderId,
        amountInPaise: order.amountInPaise,
        currency: order.currency,
        keyId: razorpayKeyId,
        receipt: order.receipt,
      },
    };
  }

  /**
   * Verify UPI payment after completion
   * POST /payments/upi/verify
   */
  @Post('upi/verify')
  async verifyUPIPayment(
    @Req() req: any,
    @Body() dto: VerifyUPIPaymentDto,
  ) {
    const order = await this.razorpayService.verifyPayment(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );

    // TODO: Add credits to user's balance based on order.referenceId (bundleId)
    // This should call creditsService.addCreditsFromPurchase()

    return {
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        method: order.method,
        vpa: order.vpa,
        paidAt: order.paidAt,
      },
    };
  }

  /**
   * Get Razorpay key ID for frontend integration
   * GET /payments/upi/config
   */
  @Get('upi/config')
  getUPIConfig() {
    return {
      success: true,
      data: {
        keyId: this.razorpayService.getKeyId(),
        currency: 'INR',
        name: 'Aardvark',
        description: 'Interactive Fiction Platform',
      },
    };
  }

  // ============================================================================
  // UPI Payouts (Author)
  // ============================================================================

  /**
   * Setup author's UPI payout account
   * POST /payments/upi/payout-account
   */
  @Post('upi/payout-account')
  async setupUPIPayoutAccount(
    @Req() req: any,
    @Body() dto: SetupUPIPayoutAccountDto,
  ) {
    const authorId = req.user?.id || 'mock-author-id';

    const account = await this.razorpayService.setupAuthorUPIAccount(
      authorId,
      dto.upiVpa,
      dto.accountHolderName,
    );

    return {
      success: true,
      data: {
        id: account.id,
        upiVpa: account.upiVpa,
        accountHolderName: account.upiAccountHolderName,
        verified: account.upiVerified,
        payoutsEnabled: account.payoutsEnabled,
      },
    };
  }

  /**
   * Get author's UPI payout account status
   * GET /payments/upi/payout-account
   */
  @Get('upi/payout-account')
  async getUPIPayoutAccount(@Req() req: any) {
    // TODO: Get from database
    return {
      success: true,
      data: null, // Return null if not set up
    };
  }

  /**
   * Request UPI payout
   * POST /payments/upi/payout
   */
  @Post('upi/payout')
  async requestUPIPayout(
    @Req() req: any,
    @Body() dto: RequestUPIPayoutDto,
  ) {
    const authorId = req.user?.id || 'mock-author-id';

    // TODO: Calculate available balance from earnings
    const availableBalancePaise = dto.amount || 50000; // Default mock

    const payout = await this.razorpayService.createPayout(
      authorId,
      availableBalancePaise,
      'Aardvark author earnings',
    );

    return {
      success: true,
      data: {
        id: payout.id,
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        upiVpa: payout.upiVpa,
        requestedAt: payout.requestedAt,
      },
    };
  }

  /**
   * Get payout history
   * GET /payments/upi/payouts
   */
  @Get('upi/payouts')
  async getUPIPayoutHistory(@Req() req: any) {
    // TODO: Get from database
    return {
      success: true,
      data: [],
    };
  }

  // ============================================================================
  // Razorpay Webhooks
  // ============================================================================

  /**
   * Handle Razorpay webhooks
   * POST /payments/razorpay-webhook
   */
  @Post('razorpay-webhook')
  @HttpCode(HttpStatus.OK)
  async handleRazorpayWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const body = req.rawBody?.toString() || '';

    if (!this.razorpayService.verifyWebhookSignature(body, signature)) {
      return { received: false, error: 'Invalid signature' };
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    await this.razorpayService.handleWebhook(event, payload.payload);

    return { received: true };
  }
}
