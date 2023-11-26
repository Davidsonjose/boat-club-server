import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventsCategoryEnum } from 'src/interface/events';
import { UserVisitPayload, VisitDetails } from '../token';
import { User } from '@prisma/client';

export class CreateEventDto {
  title: string;
  category: EventsCategoryEnum;
  amount?: string;
  visitor?: any;
  user: User;
}

export class GetEventsDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  pageSize: number;
}

export class UserEventPayload {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  amount?: string;
  @ApiProperty({ enum: EventsCategoryEnum, enumName: 'Event Category' })
  category: EventsCategoryEnum;
  @ApiProperty()
  name?: string;

  @ApiProperty()
  visitor: VisitDetails;
}
