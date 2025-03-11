import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { otpProviders } from './otp.providers';
import { DatabaseModule } from '../../database';
import { JWT_SECRET } from '../../utils';
import { usersProviders, UsersService } from '../users';
import { AuthorizationService, MailService } from '../../services';

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
