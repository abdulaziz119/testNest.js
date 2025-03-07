import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BasketModule } from './basket/basket.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    OrderModule,
    ProductModule,
    CategoryModule,
    BasketModule,
  ],
})
export class ModulesModule {}
