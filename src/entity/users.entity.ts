import { Column, Entity, Unique, Index, OneToMany } from 'typeorm';
import { DB_SCHEMA } from '../utils';
import { BaseEntity } from './base.entity';
import { BasketEntity } from './basket.entity';
import { OrderEntity } from './order.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserLanguage {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en',
}

@Entity({ schema: DB_SCHEMA, name: 'users', synchronize: true })
@Unique(['email'])
@Index(['firstName', 'lastName'])
export class UsersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'varchar', default: 'uz' })
  language: UserLanguage;

  @Column({ unique: true })
  email: string;

  @Column({ select: false, length: 255, default: null })
  password: string;

  @OneToMany(() => BasketEntity, (basket) => basket.user)
  baskets: BasketEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
