import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BasketModule } from './basket/basket.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    OtpModule,
    OrderModule,
    ProductModule,
    CategoryModule,
    BasketModule,
  ],
})
export class ModulesModule {}
