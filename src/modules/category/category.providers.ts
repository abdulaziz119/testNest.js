import { DataSource } from 'typeorm';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';
import { CategoryEntity } from '../../entity/category.entity';

export const categoryProviders = [
  {
    provide: MODELS.CATEGORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
