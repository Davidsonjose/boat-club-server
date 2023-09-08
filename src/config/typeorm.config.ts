import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/resources/auth/user.entity';
import { Location } from 'src/resources/location/location.entity';
import { Settings } from 'src/resources/settings/settings.entity';
import { Notifications } from 'src/resources/notification/notification.entity';
import { RefreshToken } from 'src/resources/auth/refreshToken.entity';
import { Company } from 'src/resources/company/company.entity';
import { Activities } from 'src/resources/activity/activity.entity';
import { Code } from 'src/resources/code/code.entity';
import { Visitor } from 'src/resources/vms/token/visitor.entity';
import { Guest } from 'src/resources/vms/guest/guest.entity';
import { Events } from 'src/resources/events/events.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const isProduction = configService.get('STAGE') === 'prod';
    return {
      // ssl: !isProduction,
      // extra: {
      //   ssl: !isProduction ? { rejectUnauthorized: false } : null,
      // },
      ssl: isProduction,
      extra: {
        ssl: isProduction ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      autoLoadEntities: true,
      entities: [
        User,
        Location,
        Settings,
        Notifications,
        RefreshToken,
        Company,
        Activities,
        Code,
        Visitor,
        Guest,
        Events,
      ],
      synchronize: true,
    };
  },
  inject: [ConfigService],

  //   repositories: []
};
