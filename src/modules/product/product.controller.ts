import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { ProductsService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import {
  PaginationParams,
  PaginationResponse,
  ParamIdDto,
  SingleResponse,
} from '../../utils';
import { ProductEntity } from '../../entity';
import { Auth } from '../auth/decorators';

@ApiBearerAuth()
@ApiTags('Product')
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
