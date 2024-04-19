import { LockMode } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  Logger,
  NotFoundException,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {
  PaymentRepository,
  TransactionStatus,
} from 'src/db/entities/payment.entity';
import { Tenant } from 'src/db/entities/tenant.entity';
import HttpContext from 'src/misc/http-context.middleware';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  private readonly stripe = new Stripe(
    this.configService.getOrThrow('STRIPE_API_KEY'),
    { apiVersion: '2024-04-10' },
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentRepo: PaymentRepository,
    private readonly em: EntityManager,
  ) {}

  async makePayment() {
    const { user } = HttpContext.get()?.req;

    if (!user) throw new NotFoundException('User not found');

    const webUrl = 'http://localhost:3000';

    const tenant = await this.em.findOneOrFail(Tenant, user.tenantId, {
      failHandler: () =>
        new NotFoundException(`Tenant with ID: ${user.tenantId} not found`),
    });

    // create payment
    const payment = this.paymentRepo.create({ amount: 3000, tenant });

    const stripeSession = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: webUrl.concat('/payment/success'),
      cancel_url: webUrl.concat('/payment/cancelled'),
      line_items: [
        {
          quantity: 1,
          price_data: {
            unit_amount: 3000,
            currency: 'USD',
            product_data: {
              name: 'Cliff Stripe Test',
              images: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA7LLbJEINqiQp3UidRJrn9KJDAXO3K9g6YuKYO_h0mA&s',
              ],
            },
          },
        },
      ],
    });

    payment.stripePaymentId = stripeSession.id;
    await this.paymentRepo.flush();

    // checkoutUrl
    return stripeSession.url;
  }

  async handleWebHook(req: RawBodyRequest<Request>) {
    const event = await this.stripe.webhooks.constructEventAsync(
      req.rawBody,
      req.headers['stripe-signature'],
      this.configService.get('STRIPE_ENDPOINT_SECRET'),
    );
    this.logger.log('Received Stripe Webhook: '.concat(event.type));

    const session = event.data.object as Stripe.Checkout.Session;
    if (event.type === 'checkout.session.completed') {
      this.logger.log(session);
      this.logger.log(JSON.stringify(session));
    }

    const payment = await this.paymentRepo.findOneOrFail(
      { stripeSessionId: session.id },
      {
        lockMode: LockMode.PESSIMISTIC_WRITE,
        failHandler: () =>
          new NotFoundException(
            `Payment with session ID: ${session.id} not found`,
          ),
      },
    );

    payment.stripePaymentId = session.payment_intent.toString();
    payment.amount = session.amount_subtotal;
    payment.status = TransactionStatus.Completed;

    await this.paymentRepo.flush();
  }
}
