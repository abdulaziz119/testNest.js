import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthSignInDto, SingleResponse } from '../../utils/dto/dto';
import { UsersEntity } from '../../entity/users.entity';
import { UsersService } from './users.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/users.dto';

@Controller('/frontend/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() body: AuthRegisterDto,
  ): Promise<SingleResponse<{ user: string }>> {
    return await this.usersService.register(body);
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() body: AuthLoginDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return await this.usersService.loginHashed(body);
  }

  @Post('/forgot-password')
  @HttpCode(200)
  async signIn(
    @Body() body: AuthSignInDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return await this.usersService.signIn(body);
  }
}
