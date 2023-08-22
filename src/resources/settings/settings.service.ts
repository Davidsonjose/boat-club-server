import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/repository/notification.repository';
import { Settings } from './settings.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSettingDto } from 'src/dto/settings/settings.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>, // private userService: UserService,
  ) {}

  async createUserSettings(
    createSettingDto: CreateSettingDto,
  ): Promise<Settings> {
    const { defaultCurrencyCode, defaultCurrencyName, defaultCurrencySymbol } =
      createSettingDto;

    // const user = this.userService.getSingleUser(userId);
    const newsettings = this.settingsRepository.create({
      defaultCurrencyCode,
      defaultCurrencyName,
      defaultCurrencySymbol,
    });

    await newsettings.save();
    return newsettings;
  }
}
