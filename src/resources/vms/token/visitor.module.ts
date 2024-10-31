import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/resources/user/user.module';
import { DatabaseService } from 'src/services/database/database.service';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { GenerateRandom } from 'src/helpers/generate-random';
import { RabbitMQService } from 'src/services/rabbitMQ/rabbitmq.service';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
  ],
  providers: [VisitorService, DatabaseService, GenerateRandom, RabbitMQService],
  controllers: [VisitorController],
  exports: [VisitorService],
})
export class VisitorModule {}
