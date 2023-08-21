import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export function Trim() {
  return Transform(({ value }) => (value as string)?.trim());
}

export function ToLowerCase() {
  return Transform(({ value }) => (value as string)?.toLowerCase());
}

export function Email() {
  return applyDecorators(IsEmail(), Trim(), ToLowerCase());
}
