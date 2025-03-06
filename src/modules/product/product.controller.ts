import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  PaginationParams,
  ParamIdDto,
  SingleResponse,
} from '../../utils/dto/dto';
import { DeleteResult } from 'typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { ProductsService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductEntity } from '../../entity/product.entity';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductsService) {}

  @Post('/create')
  @HttpCode(201)
  @Auth()
  async create(
    @Body() body: CreateProductDto,
  ): Promise<SingleResponse<ProductEntity>> {
    return await this.productService.create(body);
  }

  @Post('/findAll')
  @HttpCode(200)
  @Auth()
  async findAll(
    @Body() payload: PaginationParams,
  ): Promise<PaginationResponse<ProductEntity[]>> {
    return await this.productService.findAll(payload);
  }

  @Post('/findOne')
  @HttpCode(200)
  @Auth()
  async findOne(
    @Body() body: ParamIdDto,
  ): Promise<SingleResponse<ProductEntity>> {
    return await this.productService.findOne(body);
  }

  @Post('/update')
  @HttpCode(202)
  @Auth()
  async update(
    @Body() body: UpdateProductDto,
  ): Promise<SingleResponse<ProductEntity>> {
    return this.productService.update(body);
  }

  @Post('/remove')
  @Auth()
  @HttpCode(204)
  async delete(@Body() body: ParamIdDto): Promise<DeleteResult> {
    return this.productService.remove(body);
  }
}
