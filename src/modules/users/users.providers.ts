import { DataSource } from 'typeorm';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';
import { UsersEntity } from '../../entity/users.entity';

export const usersProviders = [
  {
    provide: MODELS.USERS,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UsersEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
