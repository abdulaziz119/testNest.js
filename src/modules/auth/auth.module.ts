import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module'; // Import DatabaseModule
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_SECRET } from '../../utils/env';
import { MailService } from '../../services/mail.service';
import { usersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';
import { AuthorizationService } from '../../services/authorization.service';
import { otpProviders } from './otp.providers';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: JWT_SECRET,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    ...usersProviders,
    ...otpProviders,
    JwtStrategy,
    UsersService,
    AuthService,
    AuthorizationService,
    MailService,
  ],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
