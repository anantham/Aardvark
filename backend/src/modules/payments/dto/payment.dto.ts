import {
  IsString,
  IsUUID,
  IsOptional,
  IsUrl,
  IsEnum,
} from 'class-validator';

/**
 * DTO for creating a checkout session for credit purchase
 */
export class CreateCreditCheckoutDto {
  @IsUUID()
  bundleId: string;

  @IsUrl()
  successUrl: string;

  @IsUrl()
  cancelUrl: string;
}

/**
 * DTO for creating a checkout session for subscription
 */
export class CreateSubscriptionCheckoutDto {
  @IsUUID()
  planId: string;

  @IsUrl()
  successUrl: string;

  @IsUrl()
  cancelUrl: string;
}

/**
 * DTO for creating a setup intent
 */
export class CreateSetupIntentDto {
  @IsOptional()
  @IsString()
  returnUrl?: string;
}

/**
 * DTO for creating a Connect account for author payouts
 */
export class CreateConnectAccountDto {
  @IsString()
  country: string;

  @IsEnum(['individual', 'company'])
  businessType: 'individual' | 'company';

  @IsUrl()
  returnUrl: string;

  @IsUrl()
  refreshUrl: string;
}

/**
 * DTO for canceling a subscription
 */
export class CancelSubscriptionDto {
  @IsOptional()
  cancelImmediately?: boolean;
}
