import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MODELS } from '../../constants';
import { AuthorizationService } from '../../services/authorization.service';
import { SingleResponse } from '../../utils/dto/dto';
import { AuthOtpDto, AuthVerifyDto } from './dto/otp.dto';
import { OtpEntity } from '../../entity/otp.entity';
import { UsersEntity } from '../../entity/users.entity';
import { MailService } from '../../services/mail.service';

@Injectable()
export class OtpService {
  constructor(
    @Inject(MODELS.OTP)
    private readonly otpRepo: Repository<OtpEntity>,
    @Inject(MODELS.USERS)
    private readonly usersRepo: Repository<UsersEntity>,
    private readonly authorizationService: AuthorizationService,
    private readonly mailService: MailService,
  ) {}

  async signVerify(
    payload: AuthVerifyDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    try {
      const otp: OtpEntity = await this.otpRepo.findOne({
        where: {
          email: payload.email,
        },
      });

      if (
        !otp ||
        otp.otp !== payload.otp ||
        otp.otpSendAt < new Date(Date.now() - 60000)
      ) {
        throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
      }
      otp.retryCount += 1;
      await this.otpRepo.update({ email: payload.email }, otp);
      const user: UsersEntity = await this.usersRepo.findOne({
        where: {
          email: payload.email,
        },
      });

      const token: string = await this.authorizationService.sign(
        user.id,
        user.email,
      );

      return { result: { user, token } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to login. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async otpVerify(
    payload: AuthOtpDto,
  ): Promise<SingleResponse<{ otp: string }>> {
    try {
      const otp: OtpEntity = await this.otpRepo.findOne({
        where: { email: payload.email },
      });

      const newOtp = {
        email: payload.email,
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        otpSendAt: new Date(),
        retryCount: 1,
      };

      if (!otp) {
        await this.otpRepo.save(newOtp);
      } else {
        newOtp.retryCount += otp.retryCount;
        await this.otpRepo.update({ email: payload.email }, newOtp);
      }

      try {
        await this.mailService.sendOtpEmail(payload.email, newOtp.otp);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      return { result: { otp: '60 seconds' } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to login. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
