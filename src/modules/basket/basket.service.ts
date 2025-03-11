import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import {
  AddToBasketDto,
  PaginationBasketParams,
  UpdateBasketDto,
} from './dto/basket.dto';
import { BasketEntity, ProductEntity, UsersEntity } from '../../entity';
import {
  getPaginationResponse,
  PaginationResponse,
  ParamIdDto,
  SingleResponse,
} from '../../utils';
import { MODELS } from '../../constants';

@Injectable()
export class BasketsService {
  constructor(
    @Inject(MODELS.BASKET)
    private basketRepository: Repository<BasketEntity>,
    @Inject(MODELS.PRODUCT)
    private productRepository: Repository<ProductEntity>,
    @Inject(MODELS.USERS)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async addToBasket(
    addToBasketDto: AddToBasketDto,
  ): Promise<SingleResponse<BasketEntity>> {
    const { userId, productId, quantity } = addToBasketDto;
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const user: UsersEntity = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    let basket: BasketEntity = await this.basketRepository.findOne({
      where: {
        user: { id: user.id },
        product: { id: productId },
      },
    });
    if (basket) {
      basket.quantity += quantity;
    } else {
      basket = this.basketRepository.create({
        user,
        product,
        quantity,
      });
    }
    const newBasket: BasketEntity = await this.basketRepository.save(basket);
    return { result: newBasket };
  }

  async findAll(
    payload: PaginationBasketParams,
  ): Promise<PaginationResponse<BasketEntity[]>> {
    const page: number = payload.page || 1;
    const limit: number = payload.limit || 10;
    const count: number = await this.basketRepository.count();
    if (!count) return getPaginationResponse([], page, limit, count);
    const serverKeys: BasketEntity[] = await this.basketRepository.find({
      where: { user: { id: payload.id } },
      relations: ['product'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return getPaginationResponse<BasketEntity>(serverKeys, page, limit, count);
  }

  async update(
    updateBasketDto: UpdateBasketDto,
  ): Promise<SingleResponse<BasketEntity>> {
    const basket: BasketEntity = await this.basketRepository.findOne({
      where: { id: updateBasketDto.id, user: { id: updateBasketDto.user_id } },
    });
    if (!basket) throw new NotFoundException('Basket item not found');
    basket.quantity = updateBasketDto.quantity;
    return { result: await this.basketRepository.save(basket) };
  }

  async remove(payload: ParamIdDto): Promise<DeleteResult> {
    const { id } = payload;
    return await this.basketRepository.softDelete(id);
  }
}
