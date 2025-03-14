import {
  HttpException,
  Inject,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CategoryEntity, ProductEntity } from '../../entity';
import {
  getPaginationResponse,
  PaginationParams,
  PaginationResponse,
  ParamIdDto,
  SingleResponse,
} from '../../utils';
import { MODELS } from '../../constants';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(MODELS.PRODUCT)
    private productRepository: Repository<ProductEntity>,
    @Inject(MODELS.CATEGORY)
    private categoryRepository: Repository<CategoryEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
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

      await this.cacheManager.del('products_all');

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

    const cacheKey = `products_all_page${page}_limit${limit}`;

    const cachedProducts = await this.cacheManager.get(cacheKey);
    if (cachedProducts) {
      return cachedProducts as PaginationResponse<ProductEntity[]>;
    }

    const count: number = await this.productRepository.count();

    if (!count) return getPaginationResponse([], page, limit, count);

    const serverKeys = await this.productRepository.find({
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    });

    const response = getPaginationResponse<ProductEntity>(
      serverKeys,
      page,
      limit,
      count,
    );

    await this.cacheManager.set(cacheKey, response);

    return response;
  }

  async findOne(payload: ParamIdDto): Promise<SingleResponse<ProductEntity>> {
    try {
      const cacheKey = `product_${payload.id}`;

      const cachedProduct = await this.cacheManager.get(cacheKey);
      if (cachedProduct) {
        return cachedProduct as SingleResponse<ProductEntity>;
      }

      const product: ProductEntity | null =
        await this.productRepository.findOne({
          where: { id: payload.id },
          relations: ['category'],
        });
      if (!product) throw new NotFoundException('Product not found');

      const response = { result: product };

      await this.cacheManager.set(cacheKey, response);

      return response;
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

      await this.cacheManager.del(`product_${id}`);
      await this.cacheManager.del('products_all');

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

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products_all');

    return this.categoryRepository.softDelete(id);
  }
}
