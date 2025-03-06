import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DB_SCHEMA } from '../utils/env';
import { BaseEntity } from './base.entity';
import { CategoryEntity } from './category.entity';
import { BasketEntity } from './basket.entity';
import { OrderEntity } from './order.entity';

@Entity({ schema: DB_SCHEMA, name: 'products', synchronize: true })
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

  @OneToMany(() => BasketEntity, (basket) => basket.product)
  baskets: BasketEntity[];

  @OneToMany(() => OrderEntity, (order) => order.product)
  orders: OrderEntity[];
}
