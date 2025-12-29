import { Controller, Post, Body } from '@nestjs/common';
import { EventDto } from './dto/event.dto';

@Controller('events')
export class EventsController {
  constructor() {}

  @Post()
  async ingest(@Body() eventDto: EventDto) {
    console.log(eventDto);
    return { success: true, message: 'Event queued' };
  }
}
