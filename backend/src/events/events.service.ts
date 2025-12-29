import { Injectable, Inject } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { QUEUE_TOKEN } from '../queue/queue.module';
import { Queue } from 'bullmq';

@Injectable()
export class EventsService {
  constructor(@Inject(QUEUE_TOKEN) private readonly queue: Queue) {}

  async enqueueEvent(eventDto: EventDto) {
    await this.queue.add('process-event', eventDto);
  }
}
