import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserLocationDto } from 'src/dto/auth/user.dto';
import { Location } from 'src/resources/location/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  //   async createUserLocation(createLocationDto: CreateUserLocationDto) {
  //     const {
  //       ipAddress,
  //       latitude,
  //       longitude,
  //       country,
  //       countryCode,
  //       dialCode,
  //       continent,
  //       borders,
  //       timezone,
  //       utc,
  //       isEu,
  //     } = createLocationDto;

  //     const newlocation = this.locationRepository.create;
  //   }
}
