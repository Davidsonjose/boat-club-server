import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '..';
import { IsString } from 'class-validator';

export class FilterNewsCategoryDto extends PaginationDto {
  @ApiProperty()
  name: string;
}
export class FilterNewsDto extends PaginationDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryId: number;
}

export class CreateNewsDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  coverImage: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({
    type: [String],
  })
  images: string[];
}

export class CreateNewsCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}

class CategoryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Restaurant' })
  name: string;

  @ApiProperty({ example: 'Category for restaurants' })
  description: string;
}

export class NewsDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Central Park news' })
  title: string;

  @ApiProperty({ example: 'A relaxing news of Central Park.' })
  description: string;

  @ApiProperty({ example: false })
  deleted: boolean;

  @ApiProperty({ type: () => CategoryDto })
  category: CategoryDto;

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

export class GetAllNewsResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        title: 'Banter Happening',
        coverImage: 'https://unsplash.com/',
        images: ['https://unsplash.com/'],
        description:
          'This is boat news. This is boat news pulled from their social media handle....',
        category: {
          id: 1,
          name: 'Facebook',
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isArray: true,
    description: 'Array of news',
  })
  data: NewsDto[];

  @ApiProperty({ example: 'Retrieved all news' })
  message: string;
}

export class GetNewsDetailsResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      title: 'Banter Happening',
      coverImage: 'https://unsplash.com/',
      images: ['https://unsplash.com/'],
      description:
        'This is boat news. This is boat news pulled from their social media handle....',
      category: {
        id: 1,
        name: 'Facebook',
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },

    isArray: false,
    description: 'object news',
  })
  data: NewsDto[];

  @ApiProperty({ example: 'Retrieved single news' })
  message: string;
}

export class GetAllNewsCategoryResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'Park',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isArray: true,
    description: 'Array of news category details',
  })
  data: CategoryDto;

  @ApiProperty({ example: 'Retrieved all news category details' })
  message: string;
}

export class GetSingleNewsCategoryResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      name: 'Park',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },

    isArray: false,
    description: 'news category details',
  })
  data: CategoryDto;

  @ApiProperty({ example: 'Retrieved all news category details' })
  message: string;
}
