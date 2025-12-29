import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsNumber()
  @IsNotEmpty()
  timestamp: number;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsOptional()
  entityId: string;

  @IsObject()
  @IsOptional()
  context: object;
}
