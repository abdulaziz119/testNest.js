import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthOtpDto, AuthVerifyDto } from './dto/otp.dto';
import { SingleResponse } from '../../utils/dto/dto';
import { UsersEntity } from '../../entity/users.entity';
import { OtpService } from './otp.service';

@Controller('/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/sign-verify')
  @HttpCode(200)
  async signVerify(
    @Body() body: AuthVerifyDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return this.otpService.signVerify(body);
  }

  @Post('/otp-verify')
  @HttpCode(200)
  async otpVerify(
    @Body() body: AuthOtpDto,
  ): Promise<SingleResponse<{ otp: string }>> {
    return this.otpService.otpVerify(body);
  }
}
