import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { categoryProviders } from './category.providers';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [...categoryProviders, CategoryService],
})
export class CategoryModule {}
