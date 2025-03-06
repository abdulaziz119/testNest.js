import {
  Length,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Gender, UserLanguage } from '../../entity/users.entity';

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserLanguage, { message: 'Language must be either uz, ru or en' })
  language: UserLanguage;

  @IsEnum(Gender, { message: 'Gender must be either male or female' })
  gender: Gender;

  @IsNotEmpty()
  birthday: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}

export class AuthResDto {
  access_token: string;
  expires_in: number;
  token_type: string;
}

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
