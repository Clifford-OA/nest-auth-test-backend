import {
  BadRequestException,
  Controller,
  HttpCode,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { PublicApi } from 'src/decorators/public-api-decorator';
import { PaymentService } from 'src/services/payment.service';

@Controller('/webhooks')
@PublicApi()
@ApiTags('Webhooks')
@ApiExcludeController(true)
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('/stripe')
  @HttpCode(200)
  async stripePaymentWebhook(@Req() req) {
    try {
      await this.paymentService.handleWebHook(req);
    } catch (err) {
      this.logger.error('Stripe Webhook Error');
      this.logger.error(err);
      throw new BadRequestException();
    }
  }
}
