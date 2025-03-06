import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { MODELS } from '../../constants';
import { BasketEntity } from '../../entity/basket.entity';
import { ProductEntity } from '../../entity/product.entity';
import { UsersEntity } from '../../entity/users.entity';
import {
  AddToBasketDto,
  PaginationBasketParams,
  UpdateBasketDto,
} from './dto/basket.dto';
import { ParamIdDto, SingleResponse } from '../../utils/dto/dto';
import { getPaginationResponse } from '../../utils/pagination.builder';
import { PaginationResponse } from '../../utils/pagination.response';

@Injectable()
export class BasketsService {
  constructor(
    @Inject(MODELS.BASKET)
    private basketRepository: Repository<BasketEntity>,
    @Inject(MODELS.PRODUCT)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async addToBasket(
    addToBasketDto: AddToBasketDto,
  ): Promise<SingleResponse<BasketEntity>> {
    const { productId, quantity } = addToBasketDto;
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    let basket = await this.basketRepository.findOne({
      where: {
        user: { id: addToBasketDto.user_id },
        product: { id: productId },
      },
    });
    if (basket) {
      basket.quantity += quantity;
    } else {
      basket = await this.basketRepository.create({ product, quantity });
    }
    const newBasket = await this.basketRepository.save(basket);
    return { result: newBasket };
  }

  async findAll(
    payload: PaginationBasketParams,
  ): Promise<PaginationResponse<BasketEntity[]>> {
    const page: number = payload.page || 1;
    const limit: number = payload.limit || 10;
    const count: number = await this.basketRepository.count();
    if (!count) return getPaginationResponse([], page, limit, count);
    const serverKeys = await this.basketRepository.find({
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
    const basket = await this.basketRepository.findOne({
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

  async clear(user: UsersEntity): Promise<void> {
    await this.basketRepository.delete({ user: { id: user.id } });
  }
}
