import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '..';
import { EventStatus } from '@prisma/client';

export class FilterClubEventsDto extends PaginationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: EventStatus, enumName: 'eventStatus' })
  eventStatus: EventStatus;

  @ApiProperty()
  locationId: number;
}

export class CreateEventDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  locationId: number;

  @ApiProperty()
  coverImage: string;

  @ApiProperty({
    type: [String],
  })
  images: string[];
}

class LocationDto {
  @ApiProperty({ example: 40.7128 })
  longitude: number;

  @ApiProperty({ example: -74.006 })
  latitude: number;

  @ApiProperty()
  name: string;
}

class EventsDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [LocationDto] })
  location: LocationDto[];

  @ApiProperty({ example: 'https://example.com/cover-image.jpg' })
  coverImage: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ enum: EventStatus, enumName: 'Event Status' })
  eventStatus: EventStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  startDate: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  endDate: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}

export class GetAllClubEventsResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'Esatate Boat Game',
        description:
          'This write up talks about details ining guests. rules for competitions etc. This write up talks about event details including guests. rules for competitions etc. This write up talks about event details including guests, rules for competitions etc.',
        location: {
          id: 1,
          longitude: 40.785091,
          latitude: -73.968285,
          name: 'Central Park',
        },
        eventStatus: EventStatus.ONGOING,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isArray: true,
    description: 'Array of club events',
  })
  data: EventsDto[];

  @ApiProperty({ example: 'Retrieved all club events' })
  message: string;
}
export class GetClubEventsDetailsResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      name: 'Esatate Boat Game',
      coverImage: 'https://unsplash.com/',
      images: ['https://unsplash.com/'],
      description:
        'This write up talks about details ining guests. rules for competitions etc. This write up talks about event details including guests. rules for competitions etc. This write up talks about event details including guests, rules for competitions etc.',
      location: {
        id: 1,
        longitude: 40.785091,
        latitude: -73.968285,
        name: 'Central Park',
      },
      eventStatus: EventStatus.ONGOING,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    isArray: false,
    description: 'object of club events',
  })
  data: EventsDto;

  @ApiProperty({ example: 'Retrieved club events details' })
  message: string;
}
