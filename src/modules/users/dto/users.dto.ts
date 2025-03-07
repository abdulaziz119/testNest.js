import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsDateString,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import { Gender, UserLanguage } from '../../../entity/users.entity';
export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  birthday: string;

  @IsEnum(UserLanguage)
  @IsOptional()
  language?: UserLanguage = UserLanguage.UZ;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @IsDefined()
  id: number;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDateString()
  @IsOptional()
  birthday?: string;

  @IsEnum(UserLanguage)
  @IsOptional()
  language?: UserLanguage;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}

export class AuthOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserResponseDto {
  id: number;

  firstName: string;

  lastName: string;

  gender: Gender;

  birthday: string;

  password: string;

  language: UserLanguage;

  email: string;
}
