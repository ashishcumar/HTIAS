import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { QueueModule } from 'src/queue/queue.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [QueueModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
})
export class EventsModule {}
