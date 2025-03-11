import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  PaginationParams,
  ParamIdDto,
  SingleResponse,
} from '../../utils/dto/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UpdateCategoryDto } from '../category/dto/categories.dto';
import { PaginationResponse } from '../../utils/pagination.response';
import { AuthOtpDto, CreateUserDto } from './dto/users.dto';
import { UsersEntity } from '../../entity/users.entity';

@ApiBearerAuth()
@ApiTags('User')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @HttpCode(201)
  @Auth()
  async create(
    @Body() body: CreateUserDto,
  ): Promise<SingleResponse<UsersEntity>> {
    return await this.usersService.create(body);
  }

  @Post('/findAll')
  @HttpCode(200)
  @Auth()
  async findAll(
    @Body() payload: PaginationParams,
  ): Promise<PaginationResponse<UsersEntity[]>> {
    return await this.usersService.findAll(payload);
  }

  @Post('/findOne')
  @HttpCode(200)
  @Auth()
  async findOne(
    @Body() body: ParamIdDto,
  ): Promise<SingleResponse<UsersEntity>> {
    return await this.usersService.findOne(body);
  }

  @Post('/findByEmail')
  @HttpCode(200)
  @Auth()
  async findByEmail(
    @Body() body: AuthOtpDto,
  ): Promise<SingleResponse<UsersEntity>> {
    return await this.usersService.findByEmail(body);
  }

  @Post('/update')
  @HttpCode(202)
  @Auth()
  async update(
    @Body() body: UpdateCategoryDto,
  ): Promise<SingleResponse<UsersEntity>> {
    return this.usersService.update(body);
  }

  @Post('/remove')
  @HttpCode(204)
  @Auth()
  async delete(@Body() body: ParamIdDto): Promise<DeleteResult> {
    return this.usersService.remove(body);
  }
}
