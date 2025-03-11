import { Module } from '@nestjs/common';
import { categoryProviders } from './category.providers';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from '../../database';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [...categoryProviders, CategoryService],
})
export class CategoryModule {}
