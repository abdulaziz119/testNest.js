import { Column, Entity, Unique, Index } from 'typeorm';
import { DB_SCHEMA } from '../utils';
import { BaseEntity } from './base.entity';

@Entity({ schema: DB_SCHEMA, name: 'otps', synchronize: true })
@Unique(['email'])
export class OtpEntity extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ length: 6, nullable: false })
  otp: string;

  @Column({ type: 'timestamp', nullable: false })
  otpSendAt: Date;

  @Column({ type: 'int', default: 0, nullable: false })
  retryCount: number;
}
