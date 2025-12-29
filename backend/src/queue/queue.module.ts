import { Queue } from 'bullmq';
import { Module } from '@nestjs/common';

export const QUEUE_TOKEN = 'EVENTS_QUEUE';

const queueProvider = {
  provide: QUEUE_TOKEN,
  useFactory: () => {
    return new Queue('events', {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });
  },
};

@Module({
  providers: [queueProvider],
  exports: [queueProvider],
})
export class QueueModule {}
