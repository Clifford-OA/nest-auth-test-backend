import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProtectedApi } from 'src/decorators/protected-api.decorator';
import { PaymentService } from 'src/services/payment.service';

@Controller('/payments')
@ProtectedApi()
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/make/payment')
  makePayment() {
    return this.paymentService.makePayment();
  }
}
