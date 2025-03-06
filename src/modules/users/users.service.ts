import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MODELS } from '../../constants';
import { AuthorizationService } from '../../services/authorization.service';
import { AuthSignInDto, SingleResponse } from '../../utils/dto/dto';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from '../../entity/users.entity';
import { OtpEntity } from '../../entity/otp.entity';
import { MailService } from '../../services/mail.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(MODELS.USERS)
    private readonly usersRepo: Repository<UsersEntity>,
    @Inject(MODELS.OTP)
    private readonly otpRepo: Repository<OtpEntity>,
    private readonly authorizationService: AuthorizationService,
    private readonly mailService: MailService,
  ) {}

  async register(
    payload: AuthRegisterDto,
  ): Promise<SingleResponse<{ user: string }>> {
    try {
      const passwordHashPromise = bcrypt.hash(payload.password, 10);
      const UsersModule = new UsersEntity();
      UsersModule.firstName = payload.firstName;
      UsersModule.language = payload.language;
      UsersModule.lastName = payload.lastName;
      UsersModule.gender = payload.gender;
      UsersModule.birthday = payload.birthday;
      UsersModule.email = payload.email;
      UsersModule.password = await passwordHashPromise;

      await this.usersRepo.save(UsersModule);

      const otp = await this.otpRepo.findOne({
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
      this.mailService
        .sendOtpEmail(payload.email, newOtp.otp)
        .catch((err: any): void =>
          console.error('Failed to send OTP email:', err),
        );

      return { result: { user: '60 seconds' } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to create a user. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(
    payload: AuthSignInDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    try {
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
      }

      const otp = await this.otpRepo.findOne({
        where: {
          email: payload.email,
        },
      });

      if (!otp || otp.otp !== payload.otp) {
        throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
      }

      if (otp.otpSendAt < new Date(Date.now() - 60000)) {
        throw new HttpException('OTP expired', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.usersRepo.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && key !== 'otp') {
          (user as any)[key] = value;
        }
      });

      await this.usersRepo.save(user);

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

  async loginHashed(
    payload: AuthLoginDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    try {
      const user = await this.usersRepo.findOne({
        where: { email: payload.email },
        select: [
          'id',
          'email',
          'password',
          'firstName',
          'lastName',
          'birthday',
          'gender',
          'language',
        ],
      });

      if (!user || !(await bcrypt.compare(payload.password, user.password))) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

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

  async loginPlain(
    payload: AuthLoginDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    try {
      const user = await this.usersRepo.findOne({
        where: { email: payload.email },
        select: [
          'id',
          'email',
          'password',
          'firstName',
          'lastName',
          'birthday',
          'gender',
          'language',
        ],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      if (user.password === null) {
        await this.usersRepo.update(
          { id: user.id },
          { password: payload.password },
        );
      }

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
}
