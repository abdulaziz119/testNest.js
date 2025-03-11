import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { BasketsService } from './basket.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationResponse, ParamIdDto, SingleResponse } from '../../utils';
import { BasketEntity } from '../../entity';
import {
  AddToBasketDto,
  PaginationBasketParams,
  UpdateBasketDto,
} from './dto/basket.dto';
import { Auth, User } from '../auth/decorators';

@ApiBearerAuth()
@ApiTags('Basket')
@Controller('/basket')
export class BasketController {
  constructor(private readonly basketService: BasketsService) {}

  @Post('/create')
  @HttpCode(201)
  @Auth()
  async create(
    @Body() payload: AddToBasketDto,
    @User() user,
  ): Promise<SingleResponse<BasketEntity>> {
    payload.userId = user.id;
    return await this.basketService.addToBasket(payload);
  }

  @Post('/findAll')
  @HttpCode(200)
  @Auth()
  async findAll(
    @Body() payload: PaginationBasketParams,
  ): Promise<PaginationResponse<BasketEntity[]>> {
    return await this.basketService.findAll(payload);
  }

  @Post('/update')
  @HttpCode(202)
  @Auth()
  async update(
    @Body() body: UpdateBasketDto,
  ): Promise<SingleResponse<BasketEntity>> {
    return this.basketService.update(body);
  }

  @Post('/remove')
  @HttpCode(204)
  @Auth()
  async delete(@Body() body: ParamIdDto): Promise<DeleteResult> {
    return this.basketService.remove(body);
  }
}
