import { OrderController } from './order.controller';
import { orderProviders } from './order.providers';
import { OrdersService } from './order.service';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from './order.processor';
import { DatabaseModule } from '../../database';
import { UsersModule } from '../users';
import { productProviders } from '../product';
import { basketProviders } from '../basket';

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
