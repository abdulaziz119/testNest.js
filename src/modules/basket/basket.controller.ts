import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ParamIdDto, SingleResponse } from '../../utils/dto/dto';
import { BasketsService } from './basket.service';
import { BasketEntity } from '../../entity/basket.entity';
import {
  AddToBasketDto,
  PaginationBasketParams,
  UpdateBasketDto,
} from './dto/basket.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationResponse } from '../../utils/pagination.response';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';

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
