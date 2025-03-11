import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import {
  PaginationParams,
  PaginationResponse,
  ParamIdDto,
  ParamUserIdDto,
  SingleResponse,
} from '../../utils';
import { OrderEntity } from '../../entity';
import { Auth, User } from '../auth/decorators';

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
