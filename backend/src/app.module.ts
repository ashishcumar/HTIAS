import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PrismaClient } from '@prisma/client';
import { QueueModule } from './queue/queue.module';
@Module({
  imports: [EventsModule, QueueModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
})
export class AppModule {}
