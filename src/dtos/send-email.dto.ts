import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';

export class SendEmailInput {
  @IsNotEmpty()
  templateId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  recipients: string[];

  @IsNotEmpty()
  subject: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;
}
