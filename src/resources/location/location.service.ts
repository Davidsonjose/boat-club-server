import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserLocationDto } from 'src/dto/auth/user.dto';
import { LocationRepository } from 'src/repository/location.repository';
import { getUserLocation } from 'src/services/location.service';
import { Location } from './location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>, // private userService: UserService,
  ) {}
  async getRequestLocation(ipAddress: string) {
    const response = await getUserLocation(ipAddress);
    // const response = await getUserLocation('45.77.210.72');

    const userLocation: CreateUserLocationDto = {
      ipAddress: response?.data?.ip,
      latitude: response?.data?.latitude,
      longtitude: response?.data?.longitude,
      country: response?.data?.country,
      countryCode: response?.data?.country_code,
      continent: response?.data?.continent,
      timezone: response?.data?.timezone,
      isEu: response?.data?.european_union === 'true',
    };

    const settings = {
      defaultCurrencyName: response?.data.currency,
      defaultCurrencyCode: response?.data?.currency_code,
      defaultCurrencySymbol: response?.data?.currency_symbol,
    };

    return { userLocation, settings };
  }

  async createUserLocation(
    createUserLocationDto: CreateUserLocationDto,
  ): Promise<Location> {
    const newLocation = this.locationRepository.create(createUserLocationDto);

    await newLocation.save();
    return newLocation;
  }
}
