import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { PaginationDto } from '..';

export class FilterTourCategoryDto extends PaginationDto {
  @ApiProperty()
  name: string;
}

export class FilterTourDto extends PaginationDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  tourCategoryId: number;

  @ApiProperty()
  longtitude: number;

  @ApiProperty()
  latitude: number;
}

export class CreateTourDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  locationId: number;

  @ApiProperty()
  coverImage: string;

  @ApiProperty({
    type: [String],
  })
  images: string[];

  // @ApiProperty()
  // longitude: number;

  // @ApiProperty()
  // latitude: number;

  @ApiProperty()
  tourCategoryId: number;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  otherLocationIds: number[];
}

export class CreateTourCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}

class TourCategoryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Restaurant' })
  name: string;

  @ApiProperty({ example: 'Category for restaurants' })
  description: string;
}

class LocationDto {
  @ApiProperty({ example: 40.7128 })
  longitude: number;

  @ApiProperty({ example: -74.006 })
  latitude: number;

  @ApiProperty()
  name: string;
}

export class OtherTourLocationDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Central Park Tour' })
  title: string;

  @ApiProperty({ example: 'A relaxing tour of Central Park.' })
  description: string;
}

export class TourDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Central Park Tour' })
  title: string;

  @ApiProperty({ example: 'A relaxing tour of Central Park.' })
  description: string;

  @ApiProperty({ example: false })
  deleted: boolean;

  @ApiProperty({ type: () => TourCategoryDto })
  tourCategory: TourCategoryDto;

  @ApiProperty({ type: [OtherTourLocationDto] })
  onTheWay: OtherTourLocationDto[];

  @ApiProperty({ type: [LocationDto] })
  location: LocationDto[];

  @ApiProperty()
  coverImage: string;

  @ApiProperty({
    type: [String],
  })
  images: string[];

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}

export class GetAllTourResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        title: 'Central Park Tour',
        description: 'A relaxing tour of Central Park.',
        coverImage: 'https://unsplash.com/',
        images: ['https://unsplash.com/'],
        tourCategory: {
          id: 1,
          name: 'Park',
          description: 'Category for parks',
        },
        location: {
          id: 1,
          longitude: 40.785091,
          latitude: -73.968285,
          name: 'Central Park',
        },
        onTheWay: [
          {
            id: 1,
            title: 'Central Park Tour',
            description: 'A relaxing tour of Central Park.',
            location: {
              id: 1,
              longitude: 40.785091,
              latitude: -73.968285,
              name: 'Central Park',
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isArray: true,
    description: 'Array of tours',
  })
  data: TourDto[];

  @ApiProperty({ example: 'Retrieved all tours' })
  message: string;
}

export class GetAllTourCategoryResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'Park',
        description: 'Category for parks',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isArray: true,
    description: 'Array of tour categories',
  })
  data: TourCategoryDto[];

  @ApiProperty({ example: 'Retrieved all tour categories' })
  message: string;
}

export class GetSingleTourCategoryResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      name: 'Park',
      description: 'Category for parks',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },

    isArray: false,
    description: 'Array of tour category details',
  })
  data: TourCategoryDto;

  @ApiProperty({ example: 'Retrieved all tour category details' })
  message: string;
}

export class GetSingleTourResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      title: 'Central Park Tour',
      description: 'A relaxing tour of Central Park.',
      tourCategory: {
        id: 1,
        name: 'Park',
        description: 'Category for parks',
      },
      location: {
        id: 1,
        longitude: 40.785091,
        latitude: -73.968285,
      },
      onTheWay: [
        {
          id: 1,
          title: 'Central Park Tour',
          description: 'A relaxing tour of Central Park.',
          location: {
            id: 1,
            longitude: 40.785091,
            latitude: -73.968285,
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    isArray: false,
    description: 'object of tour',
  })
  data: TourDto;

  @ApiProperty({ example: 'Retrieved tour details' })
  message: string;
}
