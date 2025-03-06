import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { DB_SCHEMA } from '../utils/env';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';
import { UsersEntity } from './users.entity';

@Entity({ schema: DB_SCHEMA, name: 'baskets', synchronize: true })
@Unique(['user', 'product'])
export class BasketEntity extends BaseEntity {
  @ManyToOne(() => UsersEntity, (user) => user.baskets)
  user: UsersEntity;

  @ManyToOne(() => ProductEntity, (product) => product.baskets)
  product: ProductEntity;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
