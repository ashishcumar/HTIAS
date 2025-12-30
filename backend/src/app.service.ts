import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { QUEUE_TOKEN } from './queue/queue.module';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(QUEUE_TOKEN) private readonly queue: Queue,
  ) {}

  async getHealth() {
    const status = {
      status: 'ok',
      database: 'unknown',
      redis: 'unknown',
      timestamp: new Date().toISOString(),
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      status.database = 'connected';
    } catch (error: any) {
      console.error(`db health error: ${error}`);
      status.database = 'disconnected';
      status.status = 'error';
    }

    try {
      await this.queue.getWaitingCount();
      status.redis = 'connected';
    } catch (error) {
      console.error(`redis health error: ${error}`);
      status.redis = 'disconnected';
      status.status = 'error';
    }

    return status;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
