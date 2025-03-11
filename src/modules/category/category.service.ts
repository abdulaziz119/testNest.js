import {
  Inject,
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';
import {
  getPaginationResponse,
  PaginationParams,
  PaginationResponse,
  ParamIdDto,
  SingleResponse,
} from '../../utils';
import { CategoryEntity } from '../../entity';
import { MODELS } from '../../constants';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(MODELS.CATEGORY)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    payload: CreateCategoryDto,
  ): Promise<SingleResponse<CategoryEntity>> {
    const { parentId, ...rest } = payload;
    let category: CategoryEntity = this.categoryRepository.create(rest);

    if (parentId) {
      const parentCategory: CategoryEntity =
        await this.categoryRepository.findOne({
          where: { id: parentId },
        });

      if (!parentCategory) {
        throw new Error(`Parent category with id ${parentId} not found`);
      }

      category.parent = parentCategory;
    }

    const newCategory: CategoryEntity =
      await this.categoryRepository.save(category);
    return { result: newCategory };
  }

  async findAll(
    payload: PaginationParams,
  ): Promise<PaginationResponse<CategoryEntity[]>> {
    const page: number = payload.page || 1;
    const limit: number = payload.limit || 10;
    const count: number = await this.categoryRepository.count();
    if (!count) return getPaginationResponse([], page, limit, count);
    const serverKeys: CategoryEntity[] = await this.categoryRepository.find({
      relations: ['parent', 'children'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return getPaginationResponse<CategoryEntity>(
      serverKeys,
      page,
      limit,
      count,
    );
  }

  async findOne(payload: ParamIdDto): Promise<SingleResponse<CategoryEntity>> {
    const category: CategoryEntity | null =
      await this.categoryRepository.findOne({
        where: { id: payload.id },
        relations: ['parent', 'children'],
      });
    if (!category) throw new NotFoundException('Category not found');
    return { result: category };
  }

  async update(
    payload: UpdateCategoryDto,
  ): Promise<SingleResponse<CategoryEntity>> {
    const { id } = payload;
    const category: CategoryEntity | null =
      await this.categoryRepository.findOne({
        where: { id },
      });
    if (!category) throw new NotFoundException('Category not found');

    try {
      Object.keys(category).forEach((key) => {
        category[key] = payload[key] || category[key];
      });
      return { result: await this.categoryRepository.save(category) };
    } catch (error) {
      throw new HttpException(
        'Error updating category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(payload: ParamIdDto): Promise<DeleteResult> {
    const { id } = payload;
    return this.categoryRepository.softDelete(id);
  }
}
