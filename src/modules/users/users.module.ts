import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { DatabaseModule } from '../../database';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...usersProviders, UsersService],
  exports: [...usersProviders, UsersService],
})
export class UsersModule {}
