import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ClerkWebhookService } from 'src/services/clerk-webhook.service';

@Controller('/clerk/webhooks')
export class ClerkWebhookController {
  constructor(private readonly clerkWebhookService: ClerkWebhookService) {}

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Headers('svix-signature') svixSignature: string,
  ) {
    if (!svixSignature) throw new BadRequestException('something went wrong.');

    // const isValid = this.clerkWebhookService.verifyWebhook(req, svixSignature);

    // if (!isValid) return;

    const event = req.body;

    if (event.type === 'user.created') {
      await this.clerkWebhookService.handleUserCreated(event);
    }

    return { success: true };
  }
}
