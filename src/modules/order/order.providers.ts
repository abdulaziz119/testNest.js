import { DataSource } from 'typeorm';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';
import { OrderEntity } from '../../entity/order.entity';

export const orderProviders = [
  {
    provide: MODELS.ORDER,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(OrderEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
