import { DataSource } from 'typeorm';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';
import { BasketEntity } from '../../entity/basket.entity';

export const basketProviders = [
  {
    provide: MODELS.BASKET,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BasketEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
