import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  DB_DB,
  DB_HOST,
  DB_PASS,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
} from '../utils/env';
import { PAY_NET_CONNECT_SOURCE } from '../constants';
import { UsersEntity } from '../entity/users.entity';
import { OtpEntity } from '../entity/otp.entity';
import { BasketEntity } from '../entity/basket.entity';
import { OrderEntity } from '../entity/order.entity';
import { ProductEntity } from '../entity/product.entity';
import { CategoryEntity } from '../entity/category.entity';

export const databaseProviders = [
  {
    provide: PAY_NET_CONNECT_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASS,
        database: DB_DB,
        synchronize: true,
        logging: false,
        schema: DB_SCHEMA,
        entities: [
          UsersEntity,
          OtpEntity,
          BasketEntity,
          OrderEntity,
          ProductEntity,
          CategoryEntity,
        ],
        // extra: {
        //   timezone: 'UTC',
        // },
      });
      await dataSource.initialize();
      return dataSource;
    },
  },
];
