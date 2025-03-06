import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthSignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
export interface SingleResponse<T> {
  result: T;
}
