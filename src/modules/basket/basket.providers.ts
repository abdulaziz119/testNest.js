import { DataSource } from 'typeorm';
import { BasketEntity } from '../../entity';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';

export const basketProviders = [
  {
    provide: MODELS.BASKET,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BasketEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
