import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventsCategoryEnum } from 'src/interface/events';
import { User } from 'src/resources/auth/user.entity';
import { Visitor } from 'src/resources/vms/token/visitor.entity';
import { UserVisitPayload, VisitDetails } from '../token';

export class CreateEventDto {
  title: string;
  category: EventsCategoryEnum;
  amount?: string;
  visitor?: Visitor;
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
