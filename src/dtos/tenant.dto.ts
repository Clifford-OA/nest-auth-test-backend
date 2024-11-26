import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Email, Trim } from 'src/decorators/transformers.decorator';

export class CreateTenantInput {
  @IsNotEmpty()
  adminLastName: string;

  @IsNotEmpty()
  adminFirstName: string;

  @Trim()
  @IsNotEmpty()
  churchName: string;

  @Email()
  adminEmail: string;

  @Email()
  churchEmail: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  adminPassword: string;
}
