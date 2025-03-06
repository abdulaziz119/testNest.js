import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ProductController } from './product.controller';
import { productProviders } from './product.providers';
import { ProductsService } from './product.service';
import { categoryProviders } from '../category/category.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [...productProviders, ...categoryProviders, ProductsService],
})
export class ProductModule {}
