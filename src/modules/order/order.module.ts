import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { OrderController } from './order.controller';
import { orderProviders } from './order.providers';
import { OrdersService } from './order.service';
import { basketProviders } from '../basket/basket.providers';
import { productProviders } from '../product/product.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
    ...orderProviders,
    ...basketProviders,
    ...productProviders,
    OrdersService,
  ],
})
export class OrderModule {}
