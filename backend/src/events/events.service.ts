import { Injectable, Inject } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { QUEUE_TOKEN } from '../queue/queue.module';
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    @Inject(QUEUE_TOKEN) private readonly queue: Queue,
    private readonly prisma: PrismaClient,
  ) {}

  async enqueueEvent(eventDto: EventDto) {
    const job = await this.queue.add('process-event', eventDto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2,
      },
    });
    return job;
  }

  async getEvents(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.count(),
    ]);

    const transformedEvents = events.map((event) => ({
      ...event,
      timestamp: event.timestamp.toString(),
    }));

    return {
      events: transformedEvents,
      total,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
