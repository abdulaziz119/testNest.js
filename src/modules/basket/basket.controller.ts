import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ParamIdDto, SingleResponse } from '../../utils/dto/dto';
import { UsersEntity } from '../../entity/users.entity';
import { BasketsService } from './basket.service';
import { BasketEntity } from '../../entity/basket.entity';
import {
  AddToBasketDto,
  PaginationBasketParams,
  UpdateBasketDto,
} from './dto/basket.dto';
import { PaginationResponse } from '../../utils/pagination.response';

@Controller('/frontend/users')
export class BasketController {
  constructor(private readonly basketService: BasketsService) {}

  @Post('/create')
  @HttpCode(201)
  async create(
    @Body() body: AddToBasketDto,
  ): Promise<SingleResponse<BasketEntity>> {
    return await this.basketService.addToBasket(body);
  }

  @Post('/findAll')
  @HttpCode(200)
  async findAll(
    @Body() payload: PaginationBasketParams,
  ): Promise<PaginationResponse<BasketEntity[]>> {
    return await this.basketService.findAll(payload);
  }

  @Post('/update')
  @HttpCode(202)
  async update(
    @Body() body: UpdateBasketDto,
  ): Promise<SingleResponse<BasketEntity>> {
    return this.basketService.update(body);
  }

  @Post('/remove')
  @HttpCode(204)
  async delete(@Body() body: ParamIdDto): Promise<DeleteResult> {
    return this.basketService.remove(body);
  }
}
