import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay.service';
import {
  UPIPaymentOrder,
  AuthorPayoutAccount,
  Payout,
  CreditBundle,
  User,
} from '@/database/entities';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      UPIPaymentOrder,
      AuthorPayoutAccount,
      Payout,
      CreditBundle,
      User,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayService],
  exports: [PaymentsService, RazorpayService],
})
export class PaymentsModule {}
