import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';
import { DB_SCHEMA } from '../utils';

@Entity({ schema: DB_SCHEMA, name: 'categories', synchronize: true })
@Unique(['name'])
export class CategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
  })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
