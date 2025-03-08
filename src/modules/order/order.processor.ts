import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('orders')
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);

  @Process('create')
  async handleOrderCreation(job: Job) {
    this.logger.debug('Start processing order creation...');
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);

    try {
      const order = job.data;
      this.logger.debug(`Order data: ${JSON.stringify(order)}`);

      this.logger.debug(`Order ${order.id} processed successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to process order: ${error.message}`);
      throw error;
    }
  }
}
