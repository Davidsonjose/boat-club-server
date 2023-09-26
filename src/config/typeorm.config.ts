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
import { parse } from 'pg-connection-string';
import { A_Notifications } from 'src/services/admin/a_notification.entity';
import { A_User } from 'src/services/admin/admin.entity';
import { A_Settings } from 'src/services/admin/a_settings.entity';
export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const isProduction = configService.get('STAGE') === 'prod';
    const entities = [
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
      A_Notifications,
      A_User,
      A_Settings,
      Events,
    ];

    const databaseUrl = process.env.DATABASE_URL;
    const connectionOptions = databaseUrl
      ? (parse(databaseUrl) as {
          host?: string;
          port?: string;
          user?: string;
          password?: string;
          database?: string;
        })
      : {};

    // console.log('Database Configuration:', {
    //   ssl: isProduction,
    //   extra: {
    //     ssl: isProduction ? { rejectUnauthorized: false } : null,
    //   },
    //   type: 'postgres',
    //   host: connectionOptions.host || 'default_host',
    //   port: parseInt(connectionOptions.port, 10) || 5432,
    //   username: connectionOptions.user || 'default_user',
    //   password: connectionOptions.password || 'default_pass',
    //   database: connectionOptions.database || 'default_db',
    // });

    if (isProduction) {
      console.log(isProduction, 'it is production');
      return {
        ssl: isProduction,
        extra: {
          ssl: isProduction ? { rejectUnauthorized: false } : null,
        },
        type: 'postgres',
        host: connectionOptions.host || 'default_host',
        port: parseInt(connectionOptions.port, 10) || 5432,
        username: connectionOptions.user || 'default_user',
        password: connectionOptions.password || 'default_pass',
        database: connectionOptions.database || 'default_db',
        autoLoadEntities: true,
        entities: entities,
        synchronize: true,
      };
    } else {
      return {
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
        entities: entities,
        synchronize: true,
      };
    }
  },
  inject: [ConfigService],

  //   repositories: []
};
