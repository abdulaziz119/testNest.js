import { DataSource } from 'typeorm';
import { CategoryEntity } from '../../entity';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';

export const categoryProviders = [
  {
    provide: MODELS.CATEGORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
