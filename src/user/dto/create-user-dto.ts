import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  // Min for digit 1 is the default
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 8,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
