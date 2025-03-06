import { DataSource } from 'typeorm';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';
import { ProductEntity } from '../../entity/product.entity';

export const productProviders = [
  {
    provide: MODELS.PRODUCT,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
