import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MODELS } from '../../constants';
import { OrderEntity, OrderStatus } from '../../entity/order.entity';
import { BasketEntity } from '../../entity/basket.entity';
import { ProductEntity } from '../../entity/product.entity';
import { UsersEntity } from '../../entity/users.entity';
import {
  PaginationParams,
  ParamIdDto,
  SingleResponse,
} from '../../utils/dto/dto';
import { getPaginationResponse } from '../../utils/pagination.builder';
import { PaginationResponse } from '../../utils/pagination.response';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { UsersService } from '../users/users.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(MODELS.ORDER)
    private orderRepository: Repository<OrderEntity>,
    @Inject(MODELS.BASKET)
    private basketRepository: Repository<BasketEntity>,
    @Inject(MODELS.PRODUCT)
    private productRepository: Repository<ProductEntity>,
    private readonly usersService: UsersService,
    @InjectQueue('orders')
    private readonly ordersQueue: Queue,
  ) {}

  async create(
    payload: CreateOrderDto,
  ): Promise<SingleResponse<OrderResponseDto>> {
    try {
      const user: SingleResponse<UsersEntity> = await this.usersService.findOne(
        {
          id: payload.userId,
        },
      );
      if (!user) throw new NotFoundException('User not found');

      const baskets: BasketEntity[] = await this.basketRepository.find({
        where: { user: { id: user.result.id } },
        relations: ['product'],
      });
      if (!baskets.length) throw new NotFoundException('Basket is empty');

      const orders: OrderEntity[] = baskets.map(
        (basket: BasketEntity): OrderEntity =>
          this.orderRepository.create({
            user: user.result,
            product: basket.product,
            quantity: basket.quantity,
            status: payload.status || OrderStatus.PENDING,
          }),
      );

      await this.basketRepository.delete({ user: { id: user.result.id } });
      const result: OrderEntity[] = await this.orderRepository.save(orders);

      this.ordersQueue.add('create', result[0]).catch((error) => {
        console.error('Error adding order to queue:', error);
      });

      return { result: result[0] };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async findAll(
    payload: PaginationParams,
  ): Promise<PaginationResponse<OrderEntity[]>> {
    const page: number = payload.page || 1;
    const limit: number = payload.limit || 10;
    const count: number = await this.orderRepository.count();
    if (!count) return getPaginationResponse([], page, limit, count);
    const serverKeys: OrderEntity[] = await this.orderRepository.find({
      relations: ['user', 'product'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return getPaginationResponse<OrderEntity>(serverKeys, page, limit, count);
  }

  async findUserOrders(
    user: UsersEntity,
  ): Promise<SingleResponse<OrderEntity[]>> {
    const orders: OrderEntity[] = await this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['product'],
    });
    if (!orders) throw new NotFoundException('Orders not found');
    return { result: orders };
  }

  async findOne(payload: ParamIdDto): Promise<SingleResponse<OrderEntity>> {
    const order: OrderEntity = await this.orderRepository.findOne({
      where: { id: payload.id },
      relations: ['user', 'product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return { result: order };
  }
}
