// rabbitmq.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  Client,
  MessagePattern,
  Payload,
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { AMQPEventPayload, EventPatternEnum } from './interface';
import { randomUUID } from 'crypto';
import { sha256Encrypt } from 'src/helpers/cryptography';
import { ConfigService } from '@nestjs/config';
import { SystemConfigDto } from 'src/config/systemConfig';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    console.log('Initializing RabbitMQ Client...');

    const rmqUrls = this.configService.get<string[]>(
      SystemConfigDto.RABBITMQ_URL,
    );
    const rmqQueue = this.configService.get<string>(SystemConfigDto.QUEUE);

    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: rmqUrls,
        queue: rmqQueue,
        queueOptions: { durable: false },
      },
    });

    console.log('connected');
    await this.client.connect();
  }

  emit(payload: AMQPEventPayload) {
    console.log(payload);
    this.client
      .emit(
        EventPatternEnum.USER_REGISTERED,
        Buffer.from(JSON.stringify(payload)),
      )
      .subscribe({
        next: (response) => console.log('Message sent successfully:', response),
        error: (error) => console.error('Error emitting message:', error),
        complete: () => console.log('Emission complete'),
      });
  }

  //GENERATE PAYLOAD META DATA
  static generateEventPayloadMetaData(data: any) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    return {
      data,
      dataSignature: sha256Encrypt(data),
      eventId: randomUUID(),
    };
  }
}
