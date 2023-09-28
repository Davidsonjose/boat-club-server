import { Injectable } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { Settings } from '../settings/settings.entity';
import {
  ForgotPasswordUpdateDto,
  ForgotPasswordVerificationDto,
  ForgotVerifyPayload,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdatePhoneDto,
  UpdatePinDto,
  UpdateProfileDto,
  VerifyPinDto,
} from 'src/dto/auth/user.dto';
import { RabbitMQService } from 'src/services/rabbitMQ/rabbitmq.service';
import {
  AMQPEventType,
  AdminTypeEmum,
  EventPatternEnum,
} from 'src/services/rabbitMQ/interface';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private rabbitMQService: RabbitMQService,
  ) {}

  async getSingleUser(userId: string, type?: string) {
    return this.userRepository.getSingleUser(userId, type);
  }

  async verifyEmail(user: User) {
    return await this.userRepository.verifyEmail(user);
  }

  async verifyPhone(user: User) {
    return await this.userRepository.verifyPhone(user);
  }

  async getUserSettings(user: User): Promise<Settings> {
    return await this.userRepository.getUserSettings(user.id);
  }

  async pushNotificationToken(deviceToken: string, user: User) {
    return await this.userRepository.pushNotificationToken(deviceToken, user);
  }

  async verifyPassword(pwd: string, user: User): Promise<void> {
    return await this.userRepository.verifyPassword(pwd, user);
  }

  async updatePin(updatePinDto: UpdatePinDto): Promise<void> {
    await this.userRepository.updatePin(updatePinDto);
  }

  async verifyPin(verifyPinDto: VerifyPinDto, user: User): Promise<void> {
    await this.userRepository.verifyPin(verifyPinDto, user);
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    user: User,
  ): Promise<void> {
    await this.userRepository.updatePassword(updatePasswordDto, user);
  }

  async forgotPasswordUpdate(forgotPasswordUpdateDto: ForgotPasswordUpdateDto) {
    try {
      return await this.userRepository.forgotPasswordUpdate(
        forgotPasswordUpdateDto,
      );
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    user: User,
  ): Promise<void> {
    await this.userRepository.updateProfile(updateProfileDto, user);
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto, user: User): Promise<void> {
    await this.userRepository.updatePhone(updatePhoneDto, user);
  }

  async updateEmail(updateEmailDto: UpdateEmailDto, user: User): Promise<void> {
    await this.userRepository.updateEmail(updateEmailDto, user);
  }

  async forgotPasswordVerify(
    forgotPasswordVerificationDto: ForgotPasswordVerificationDto,
  ): Promise<ForgotVerifyPayload> {
    return await this.userRepository.forgotPasswordVerify(
      forgotPasswordVerificationDto,
    );
  }

  async requestAccountDeletion(email: string, companyId: number) {
    return await this.userRepository.requestAccountDeletion(email, companyId);
  }

  async sendEvent() {
    await this.rabbitMQService.emit({
      ...RabbitMQService.generateEventPayloadMetaData({
        user: {
          firstName: 'Joseph',
          lastName: 'Jose',
          companyId: 'uopiion',
          userId: 'sfsfnsfsnkf',
        },
        ipAddress: '',
      }),
      eventSource: AdminTypeEmum.ADMIN,
      eventType: AMQPEventType.PUSH,
      eventPattern: EventPatternEnum.USER_REGISTERED,
    });
  }
}
