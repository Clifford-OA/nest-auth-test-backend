import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import { SendEmailInput } from 'src/dtos/send-email.dto';
import fs from 'fs/promises';
import mustache from 'mustache';

const templateFolder = path.join(__dirname, 'templates');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress = process.env.SMPT_SENDER_ADDRESS;
  private readonly transporter?: Transporter;
  //   private readonly maxRequestsPerSecond = 1;
  //   private readonly minRequestInterval = 1000 / this.maxRequestsPerSecond;
  //   private lastRequestTime = 0;

  constructor() {
    if (process.env.DISABLE_EMAILS !== 'true') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: Number(process.env.SMPT_PORT),
        auth: {
          user: process.env.SMPT_USERNAME,
          pass: process.env.SMPT_PASSWORD,
        },
      });
    }
  }

  //   private onModuleInit() {
  //     ///
  //     this.sendEmail({
  //       recipients: ['clifford.osei@accede.dev'],
  //       subject: 'Test Email',
  //       templateId: 'authentication',
  //     });
  //   }

  async sendEmail(input: SendEmailInput) {
    const templateHtml = await fs
      .readFile(path.join(templateFolder, `${input.templateId}.html`), {
        encoding: 'utf-8',
      })
      .catch((err) => {
        if (err.code === 'ENOENT') {
          // file not found
          err = new BadRequestException('Invalid template ID');
        }
        throw err;
      });

    try {
      // Replace template variables if specified
      const messageBody = input.variables
        ? mustache.render(templateHtml, input.variables)
        : templateHtml;

      if (this.transporter) {
        await this.transporter.sendMail({
          from: this.fromAddress,
          to: input.recipients,
          subject: input.subject,
          html: messageBody,
        });

        this.logger.log(
          `Send email to ${input.recipients.join(', ')} : ${input.templateId}`,
        );
      } else {
        this.logger.warn('The email transporter has been disabled');
      }
    } catch (err) {
      this.logger.error(
        `Failed to send email to ${input.recipients.join(', ')}:`,
        err.stack ?? err,
      );
    }
  }
}
