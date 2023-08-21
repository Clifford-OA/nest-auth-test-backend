import { IsNotEmpty, IsOptional } from 'class-validator';
import { Email, Trim } from 'src/decorators/transformers.decorator';

export class CreateUserInput {
  @Trim()
  @IsNotEmpty()
  firstName: string;

  @Trim()
  @IsNotEmpty()
  lastName: string;

  @Email()
  email: string;

  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}

export class LoginInput {
  @Email()
  email: string;

  @Trim()
  @IsNotEmpty()
  password: string;
}

export class RefreshInput {
  @Trim()
  @IsNotEmpty()
  refreshToken: string;
}

export class UpdateUserInput {
  @IsOptional()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  phoneNumber: string;
}
