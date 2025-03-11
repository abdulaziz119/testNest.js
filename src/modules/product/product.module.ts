import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { productProviders } from './product.providers';
import { ProductsService } from './product.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { REDIS_HOST, REDIS_PORT } from '../../utils';
import { DatabaseModule } from '../../database';
import { categoryProviders } from '../category';
import { CACHE_TTL } from '../../constants';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register({
      store: redisStore,
      host: REDIS_HOST || 'localhost',
      port: REDIS_PORT || 6379,
      ttl: CACHE_TTL,
      db: 0,
      // Redis operatsiya davomida log qilish
      debug: false,
    }),
  ],
  controllers: [ProductController],
  providers: [...productProviders, ...categoryProviders, ProductsService],
})
export class ProductModule {}
