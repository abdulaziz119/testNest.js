import { Column, Entity, ManyToOne } from 'typeorm';
import { DB_SCHEMA } from '../utils/env';
import { BaseEntity } from './base.entity';
import { UsersEntity } from './users.entity';
import { ProductEntity } from './product.entity';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity({ schema: DB_SCHEMA, name: 'orders', synchronize: true })
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => UsersEntity, (user) => user.orders)
  user: UsersEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;
}
