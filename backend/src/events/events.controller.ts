import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async ingest(@Body() eventDto: EventDto) {
    try {
      const job = await this.eventsService.enqueueEvent(eventDto);
      return {
        success: true,
        message: 'Event queued',
        jobId: job.id,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Error queueing event:', error);
      throw new HttpException(
        'Failed to queue event',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get()
  async getEvents(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? Number.parseInt(page, 10) : 1;
    const limitNum = limit ? Number.parseInt(limit, 10) : 10;

    return this.eventsService.getEvents(pageNum, limitNum);
  }
}
