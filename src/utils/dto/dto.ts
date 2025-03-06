import {
  IsEmail,
  IsDefined,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

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

export class PaginationParams {
  @IsDefined()
  page: number;
  @IsDefined()
  limit: number;
}

export class ParamIdDto {
  @IsDefined()
  id: number;
}
export interface SingleResponse<T> {
  result: T;
}
