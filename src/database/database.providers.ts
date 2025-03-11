import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  BasketEntity,
  CategoryEntity,
  OrderEntity,
  OtpEntity,
  ProductEntity,
  UsersEntity,
} from '../entity';
import { DB_DB, DB_HOST, DB_PASS, DB_PORT, DB_SCHEMA, DB_USER } from '../utils';
import { PAY_NET_CONNECT_SOURCE } from '../constants';

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
