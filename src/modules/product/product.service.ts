import {
  HttpException,
  Inject,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { ProductEntity } from '../../entity/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CategoryEntity } from '../../entity/category.entity';
import { MODELS } from '../../constants';
import {
  PaginationParams,
  ParamIdDto,
  SingleResponse,
} from '../../utils/dto/dto';
import { getPaginationResponse } from '../../utils/pagination.builder';
import { PaginationResponse } from '../../utils/pagination.response';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(MODELS.PRODUCT)
    private productRepository: Repository<ProductEntity>,
    @Inject(MODELS.CATEGORY)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<SingleResponse<ProductEntity>> {
    try {
      const { categoryId, ...rest } = createProductDto;
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      const product: ProductEntity = this.productRepository.create({
        ...rest,
        category,
      });
      await this.productRepository.save(product);
      return { result: product };
    } catch (error) {
      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    payload: PaginationParams,
  ): Promise<PaginationResponse<ProductEntity[]>> {
    const page: number = payload.page || 1;
    const limit: number = payload.limit || 10;
    const count: number = await this.productRepository.count();

    if (!count) return getPaginationResponse([], page, limit, count);

    const serverKeys = await this.productRepository.find({
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    });
    return getPaginationResponse<ProductEntity>(serverKeys, page, limit, count);
  }

  async findOne(payload: ParamIdDto): Promise<SingleResponse<ProductEntity>> {
    try {
      const product: ProductEntity | null =
        await this.productRepository.findOne({
          where: { id: payload.id },
          relations: ['category'],
        });
      if (!product) throw new NotFoundException('Product not found');
      return { result: product };
    } catch (error) {
      throw new HttpException(
        'Error getting product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    payload: UpdateProductDto,
  ): Promise<SingleResponse<ProductEntity>> {
    const { id } = payload;
    const product: ProductEntity | null = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException('Product not found');
    try {
      Object.keys(product).forEach((key) => {
        product[key] = payload[key] || product[key];
      });

      const updatedProduct: ProductEntity =
        await this.productRepository.save(product);
      return { result: updatedProduct };
    } catch (error) {
      throw new HttpException(
        'Error updating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(payload: ParamIdDto): Promise<DeleteResult> {
    const { id } = payload;
    return this.categoryRepository.softDelete(id);
  }
}
