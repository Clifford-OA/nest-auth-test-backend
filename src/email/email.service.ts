import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import * as pdf from 'html-pdf';
import puppeteer from 'puppeteer';
import { SendEmailInput } from 'src/dtos/send-email.dto';
import { getHtmlContent } from 'src/utils/pdf-html-content';

// import path from 'path';
// import { SendEmailInput } from 'src/dtos/send-email.dto';
// import fs from 'fs/promises';
// import mustache from 'mustache';

// import compile from 'mjml';

// const templateFolder = path.join(__dirname, 'templates');
console.log(__dirname, ' name');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress = process.env.SMPT_SENDER_ADDRESS;
  private readonly transporter?: Transporter;
  //   private readonly maxRequestsPerSecond = 1;
  //   private readonly minRequestInterval = 1000 / this.maxRequestsPerSecond;
  //   private lastRequestTime = 0;
  //
  constructor() {
    if (process.env.DISABLE_EMAILS !== 'true') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        secure: false,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USERNAME,
        },
      });
    }
  }

  // private onModuleInit() {
  //   ///
  //   this.generateFileAndSendEmail({
  //     recipients: ['clifford.osei@accede.dev'],
  //     subject: 'Test Email',
  //     templateId: 'authentication',
  //   });
  // }

  private generatePdf(
    htmlContent: string,
    options: pdf.CreateOptions,
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }

  private async generatePDFWithPuppeteer(htmlContent: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
  }

  // mjml
  // async sendEmail(input: SendEmailInput) {
  //   const templateHtml = await fs
  //     .readFile(path.join(templateFolder, `${input.templateId}.html`), {
  //       encoding: 'utf-8',
  //     })
  //     .catch((err) => {
  //       if (err.code === 'ENOENT') {
  //         // file not found
  //         err = new BadRequestException('Invalid template ID');
  //       }
  //       throw err;
  //     });

  //   try {
  //     // Replace template variables if specified
  //     const messageBody = input.variables
  //       ? mustache.render(templateHtml, input.variables)
  //       : templateHtml;

  //     if (this.transporter) {
  //       await this.transporter.sendMail({
  //         from: this.fromAddress,
  //         to: input.recipients,
  //         subject: input.subject,
  //         html: messageBody,
  //       });

  //       this.logger.log(
  //         `Send email to ${input.recipients.join(', ')} : ${input.templateId}`,
  //       );
  //     } else {
  //       this.logger.warn('The email transporter has been disabled');
  //     }
  //   } catch (err) {
  //     this.logger.error(
  //       `Failed to send email to ${input.recipients.join(', ')}:`,
  //       err.stack ?? err,
  //     );
  //   }
  // }

  async generateFileAndSendEmail(input: SendEmailInput) {
    // const tableData = [
    //   {
    //     field1: 'Hey',
    //     field2: 'Sorry',
    //     field3: 'ShowDem',
    //   },
    //   {
    //     field1: 'Hey',
    //     field2: 'Sorry',
    //     field3: 'ShowDem',
    //   },
    //   {
    //     field1: 'Hey',
    //     field2: 'Sorry',
    //     field3: 'ShowDem',
    //   },
    //   {
    //     field1: 'Hey',
    //     field2: 'Sorry',
    //     field3: 'ShowDem',
    //   },
    // ];
    // create a pdf document
    try {
      // const { html } = compile(this.generateMJMLTable(tableData));

      // const pdfOptions: pdf.CreateOptions = {
      //   format: 'Letter',
      // };

      // const pdfBuffer = await this.generatePdf(getHtmlContent(), pdfOptions);
      const pdfBuffer = await this.generatePDFWithPuppeteer(getHtmlContent());

      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to: input.recipients,
        subject: 'PDF Attachment Test',
        attachments: [
          {
            filename: 'invoice.pdf',
            content: pdfBuffer,
            encoding: 'base64',
          },
        ],
      });

      // Log the result
      console.log('Email sent:', info.response);

      // Delete the PDF file after sending the email
      // fileSystem.unlinkSync(fileName);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
