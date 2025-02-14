import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkWebhookService {
  private readonly logger = new Logger(ClerkWebhookService.name);

  constructor(private readonly configService: ConfigService) {}

  // Verify Clerk webhook signature
  //
  verifyWebhook(req: any, signature: string): boolean {
    const secret = this.configService.get<string>('CLERK_WEBHOOK_SECRET');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(req.body), 'utf8');
    const digest = hmac.digest('hex');
    return signature === digest;
  }

  async handleUserCreated(event: any) {
    const { id, email_addresses } = event.data;
    this.logger.log(
      `New user created: ${id} - ${email_addresses[0]?.email_address}`,
    );

    // Perform necessary actions (e.g., store in database)
    // Example: Save user in your DB
  }
}
