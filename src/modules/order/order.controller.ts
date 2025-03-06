import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  PaginationParams,
  ParamIdDto,
  SingleResponse,
} from '../../utils/dto/dto';
import { PaginationResponse } from '../../utils/pagination.response';
import { OrdersService } from './order.service';
import { UsersEntity } from '../../entity/users.entity';
import { OrderEntity } from '../../entity/order.entity';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrdersService) {}

  @Post('/create')
  @HttpCode(201)
  async create(@Body() body: any): Promise<SingleResponse<OrderEntity>> {
    return await this.orderService.create(body);
  }

  @Post('/findAll')
  @HttpCode(200)
  async findAll(
    @Body() payload: PaginationParams,
  ): Promise<PaginationResponse<OrderEntity[]>> {
    return await this.orderService.findAll(payload);
  }

  @Post('/findOne')
  @HttpCode(200)
  async findOne(
    @Body() body: ParamIdDto,
  ): Promise<SingleResponse<OrderEntity>> {
    return await this.orderService.findOne(body);
  }

  @Post('/findUserOrders')
  @HttpCode(200)
  async findUserOrders(
    @Body() body: UsersEntity,
  ): Promise<SingleResponse<OrderEntity[]>> {
    return await this.orderService.findUserOrders(body);
  }
}
