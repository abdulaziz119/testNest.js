import { DataSource } from 'typeorm';
import { MODELS, PAY_NET_CONNECT_SOURCE } from '../../constants';
import { OtpEntity } from '../../entity/otp.entity';

export const otpProviders = [
  {
    provide: MODELS.OTP,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OtpEntity),
    inject: [PAY_NET_CONNECT_SOURCE],
  },
];
