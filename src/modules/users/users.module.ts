import { Module } from '@nestjs/common';
import { usersProviders } from './users.providers';
import { DatabaseModule } from '../../database/database.module';
import { UsersController } from './users.controller';
import { AuthorizationService } from '../../services/authorization.service';
import { otpProviders } from '../otp/otp.providers';
import { MailService } from '../../services/mail.service';
import { UsersService } from './users.service';
@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...usersProviders,
    ...otpProviders,
    UsersService,
    AuthorizationService,
    MailService,
  ],
})
export class UsersModule {}
