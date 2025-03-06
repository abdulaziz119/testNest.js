import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class AuthOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
