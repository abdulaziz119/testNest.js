import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../database/database.module';
import { OrderController } from './order.controller';
import { orderProviders } from './order.providers';
import { productProviders } from '../product/product.providers';
import { OrdersService } from './order.service';
import { basketProviders } from '../basket/basket.providers';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from './order.processor';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    BullModule.registerQueue({
      name: 'orders',
    }),
  ],
  controllers: [OrderController],
  providers: [
    ...orderProviders,
    ...basketProviders,
    ...productProviders,
    OrdersService,
    OrderProcessor,
  ],
  exports: [OrdersService],
})
export class OrderModule {}
