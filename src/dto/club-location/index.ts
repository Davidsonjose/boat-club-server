import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '..';

export class FilterClubLocationDto extends PaginationDto {
  @ApiProperty()
  name: string;
}

export class CreateClubLocationDto {
  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  name: string;
}

class LocationDto {
  @ApiProperty({ example: 40.7128 })
  longitude: number;

  @ApiProperty({ example: -74.006 })
  latitude: number;

  @ApiProperty()
  name: string;
}

export class GetAllClubLocationResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        longitude: 40.785091,
        latitude: -73.968285,
        name: 'Central Park',

        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isArray: true,
    description: 'Array of club location',
  })
  data: LocationDto[];

  @ApiProperty({ example: 'Retrieved all club location' })
  message: string;
}

export class GetSingleClubLocationResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      longitude: 40.785091,
      latitude: -73.968285,
      name: 'Central Park',

      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },

    isArray: false,
    description: 'object of club location',
  })
  data: LocationDto[];

  @ApiProperty({ example: 'Retrieved club location' })
  message: string;
}
