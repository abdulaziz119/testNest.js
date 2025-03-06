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

@Injectable()
export class OrdersService {
  constructor(
    @Inject(MODELS.ORDER)
    private orderRepository: Repository<OrderEntity>,
    @Inject(MODELS.BASKET)
    private basketRepository: Repository<BasketEntity>,
    @Inject(MODELS.PRODUCT)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(user: UsersEntity): Promise<SingleResponse<OrderEntity>> {
    const baskets = await this.basketRepository.find({
      where: { user: { id: user.id } },
      relations: ['product'],
    });
    if (!baskets.length) throw new NotFoundException('Basket is empty');

    const orders = baskets.map((basket) =>
      this.orderRepository.create({
        user,
        product: basket.product,
        quantity: basket.quantity,
        status: OrderStatus.PENDING,
      }),
    );

    await this.basketRepository.delete({ user: { id: user.id } });
    const result = await this.orderRepository.save(orders);

    return { result: result[0] };
  }

  async findAll(
    payload: PaginationParams,
  ): Promise<PaginationResponse<OrderEntity[]>> {
    const page = payload.page || 1;
    const limit = payload.limit || 10;
    const count = await this.orderRepository.count();
    if (!count) return getPaginationResponse([], page, limit, count);
    const serverKeys = await this.orderRepository.find({
      relations: ['user', 'product'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return getPaginationResponse<OrderEntity>(serverKeys, page, limit, count);
  }

  async findUserOrders(
    user: UsersEntity,
  ): Promise<SingleResponse<OrderEntity[]>> {
    const orders = await this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['product'],
    });
    if (!orders) throw new NotFoundException('Orders not found');
    return { result: orders };
  }

  async findOne(payload: ParamIdDto): Promise<SingleResponse<OrderEntity>> {
    const order = await this.orderRepository.findOne({
      where: { id: payload.id },
      relations: ['user', 'product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return { result: order };
  }
}
