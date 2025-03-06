import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BasketController } from './basket.controller';
import { basketProviders } from './basket.providers';
import { BasketsService } from './basket.service';
import { productProviders } from '../product/product.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [BasketController],
  providers: [...basketProviders, ...productProviders, BasketsService],
})
export class BasketModule {}
