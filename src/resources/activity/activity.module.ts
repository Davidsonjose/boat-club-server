import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Activities } from './activity.entity';
import { ActivityService } from './activity.service';
import { activityController } from './activity.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Activities]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ActivityService],
  controllers: [activityController],
  exports: [ActivityService],
})
export class ActivityModule {}
