import { DataSource } from 'typeorm';
import { UsersEntity } from '../../entity';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';

export const usersProviders = [
  {
    provide: MODELS.USERS,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UsersEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
