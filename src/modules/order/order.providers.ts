import { DataSource } from 'typeorm';
import { OrderEntity } from '../../entity';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';

export const orderProviders = [
  {
    provide: MODELS.ORDER,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(OrderEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
