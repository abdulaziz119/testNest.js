import { DataSource } from 'typeorm';
import { OtpEntity } from '../../entity';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';

export const otpProviders = [
  {
    provide: MODELS.OTP,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OtpEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
