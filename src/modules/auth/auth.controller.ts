import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto, AuthVerifyDto } from './auth.dto';
import { AuthService } from './auth.service';
import { SingleResponse } from '../../utils/dto/dto';
import { UsersEntity } from '../../entity/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() body: AuthRegisterDto,
  ): Promise<SingleResponse<{ user: string }>> {
    return await this.authService.register(body);
  }

  @Post('/sign-verify')
  @HttpCode(200)
  async signVerify(
    @Body() body: AuthVerifyDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return this.authService.signVerify(body);
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() body: AuthLoginDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return await this.authService.login(body);
  }
}
