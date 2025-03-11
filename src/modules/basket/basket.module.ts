import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { basketProviders } from './basket.providers';
import { BasketsService } from './basket.service';
import { productProviders } from '../product';
import { usersProviders } from '../users';
import { DatabaseModule } from '../../database';

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
