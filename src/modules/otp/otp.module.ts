import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { otpProviders } from './otp.providers';
import { OtpController } from './otp.controller';
import { usersProviders } from '../users/users.providers';
import { AuthorizationService } from '../../services/authorization.service';
import { OtpService } from './otp.service';

import { MailService } from '../../services/mail.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OtpController],
  providers: [
    ...otpProviders,
    ...usersProviders,
    OtpService,
    AuthorizationService,
    MailService,
  ],
})
export class OtpModule {}
