import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';
import { CategoryService } from './category.service';
import {
  PaginationParams,
  PaginationResponse,
  ParamIdDto,
  SingleResponse,
} from '../../utils';
import { CategoryEntity } from '../../entity';
import { Auth } from '../auth/decorators';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @HttpCode(201)
  @Auth()
  async create(
    @Body() body: CreateCategoryDto,
  ): Promise<SingleResponse<CategoryEntity>> {
    return await this.categoryService.create(body);
  }

  @Post('/findAll')
  @HttpCode(200)
  @Auth()
  async findAll(
    @Body() payload: PaginationParams,
  ): Promise<PaginationResponse<CategoryEntity[]>> {
    return await this.categoryService.findAll(payload);
  }

  @Post('/findOne')
  @HttpCode(200)
  @Auth()
  async findOne(
    @Body() body: ParamIdDto,
  ): Promise<SingleResponse<CategoryEntity>> {
    return await this.categoryService.findOne(body);
  }

  @Post('/update')
  @HttpCode(202)
  @Auth()
  async update(
    @Body() body: UpdateCategoryDto,
  ): Promise<SingleResponse<CategoryEntity>> {
    return this.categoryService.update(body);
  }

  @Post('/remove')
  @HttpCode(204)
  @Auth()
  async delete(@Body() body: ParamIdDto): Promise<DeleteResult> {
    return this.categoryService.remove(body);
  }
}
