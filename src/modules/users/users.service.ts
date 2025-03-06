import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { MODELS } from '../../constants';
import {
  PaginationParams,
  ParamIdDto,
  SingleResponse,
} from '../../utils/dto/dto';
import * as bcrypt from 'bcryptjs';
import { DeleteResult } from 'typeorm';
import { UsersEntity } from '../../entity/users.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';
import { PaginationResponse } from '../../utils/pagination.response';
import { getPaginationResponse } from '../../utils/pagination.builder';

@Injectable()
export class UsersService {
  constructor(
    @Inject(MODELS.USERS)
    private readonly usersRepo: Repository<UsersEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<SingleResponse<UsersEntity>> {
    const hashedPassword: string = await bcrypt.hash(dto.password, 10);
    const UserModule = new UsersEntity();
    (UserModule.firstName = dto.firstName),
      (UserModule.lastName = dto.lastName),
      (UserModule.gender = dto.gender),
      (UserModule.password = dto.password),
      (UserModule.birthday = new Date(dto.birthday)),
      (UserModule.language = dto.language) || 'uz',
      (UserModule.email = dto.email),
      (UserModule.password = hashedPassword);
    try {
      return { result: await this.usersRepo.save(UserModule) };
    } catch (error: any) {
      throw new HttpException(
        `Failed to create a user. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    payload: PaginationParams,
  ): Promise<PaginationResponse<UsersEntity[]>> {
    const page = payload.page || 1;
    const limit = payload.limit || 10;
    const count = await this.usersRepo.count();
    if (!count) return getPaginationResponse([], page, limit, count);
    const serverKeys = await this.usersRepo.find({
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    });
    return getPaginationResponse<UsersEntity>(serverKeys, page, limit, count);
  }

  async findOne(payload: ParamIdDto): Promise<SingleResponse<UsersEntity>> {
    const user = await this.usersRepo.findOne({ where: { id: payload.id } });
    if (!user) throw new NotFoundException('User not found');

    return { result: user };
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(payload: UpdateUserDto): Promise<SingleResponse<UsersEntity>> {
    const { id } = payload;
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      Object.entries(user).forEach(([key, value]) => {
        user[key] = payload[key] || value;
      });
      return { result: await this.usersRepo.save(user) };
    } catch (error: any) {
      throw new HttpException(
        `Failed to update a user. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(payload: ParamIdDto): Promise<DeleteResult> {
    const { id } = payload;
    return this.usersRepo.softDelete(id);
  }
}
