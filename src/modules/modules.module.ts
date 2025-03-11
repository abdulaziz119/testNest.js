import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { DatabaseModule } from '../database';
import { UsersModule } from './users';
import { OrderModule } from './order';
import { ProductModule } from './product';
import { CategoryModule } from './category';
import { BasketModule } from './basket';

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
