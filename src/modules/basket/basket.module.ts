import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BasketController } from './basket.controller';
import { basketProviders } from './basket.providers';
import { BasketsService } from './basket.service';
import { productProviders } from '../product/product.providers';
import { orderProviders } from '../order/order.providers';
import { usersProviders } from '../users/users.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [BasketController],
  providers: [
    ...basketProviders,
    ...productProviders,
    ...usersProviders,
    BasketsService,
  ],
})
export class BasketModule {}
