import { DataSource } from 'typeorm';
import { ProductEntity } from '../../entity';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';

export const productProviders = [
  {
    provide: MODELS.PRODUCT,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
