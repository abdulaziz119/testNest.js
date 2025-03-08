import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';
import { ModulesModule } from './modules/modules.module';
import { BullModule } from '@nestjs/bull';
import { REDIS_HOST, REDIS_PORT } from './utils/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
      },
      redis: {
        host: REDIS_HOST || 'localhost',
        port: REDIS_PORT || 6379,
        db: 1,
      },
    }),
    DatabaseModule,
    ModulesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
