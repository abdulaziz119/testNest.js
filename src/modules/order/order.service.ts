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
  ) {}

  async create(
    payload: CreateOrderDto,
  ): Promise<SingleResponse<OrderResponseDto>> {
    const user = await this.usersService.findOne({ id: payload.userId });
    if (!user) throw new NotFoundException('User not found');

    const baskets = await this.basketRepository.find({
      where: { user: { id: user.result.id } },
      relations: ['product'],
    });
    if (!baskets.length) throw new NotFoundException('Basket is empty');

    const orders = baskets.map((basket) =>
      this.orderRepository.create({
        user: user.result,
        product: basket.product,
        quantity: basket.quantity,
        status: payload.status || OrderStatus.PENDING,
      }),
    );

    await this.basketRepository.delete({ user: { id: user.result.id } });
    const result = await this.orderRepository.save(orders);

    const response = {
      id: result[0].id,
      user: {
        id: user.result.id,
        email: user.result.email,
        firstName: user.result.firstName,
        lastName: user.result.lastName,
      },
      product: {
        id: result[0].product.id,
        name: result[0].product.name,
        price: result[0].product.price,
      },
      quantity: result[0].quantity,
      status: result[0].status,
    };

    return { result: response };
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
