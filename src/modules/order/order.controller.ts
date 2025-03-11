import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  PaginationParams,
  ParamIdDto,
  ParamUserIdDto,
  SingleResponse,
} from '../../utils/dto/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationResponse } from '../../utils/pagination.response';
import { OrdersService } from './order.service';
import { UsersEntity } from '../../entity/users.entity';
import { OrderEntity } from '../../entity/order.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@ApiBearerAuth()
@ApiTags('Order')
@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrdersService) {}

  @Post('/create')
  @HttpCode(201)
  @Auth()
  async create(
    @Body() payload: CreateOrderDto,
    @User() user,
  ): Promise<SingleResponse<OrderResponseDto>> {
    try {
      payload.userId = user.id;
      return await this.orderService.create(payload);
    } catch (error) {
      console.error('Error in create order controller:', error);
      throw error;
    }
  }

  @Post('/findAll')
  @HttpCode(200)
  @Auth()
  async findAll(
    @Body() payload: PaginationParams,
  ): Promise<PaginationResponse<OrderEntity[]>> {
    return await this.orderService.findAll(payload);
  }

  @Post('/findOne')
  @HttpCode(200)
  @Auth()
  async findOne(
    @Body() body: ParamIdDto,
  ): Promise<SingleResponse<OrderEntity>> {
    return await this.orderService.findOne(body);
  }

  @Post('/findUserOrders')
  @HttpCode(200)
  @Auth()
  async findUserOrders(
    @Body() body: ParamUserIdDto,
  ): Promise<SingleResponse<OrderEntity[]>> {
    return await this.orderService.findUserOrders(body);
  }
}
