import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BroadcastMessage } from './broadcast.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class BroadcastService {
  constructor(
    @InjectRepository(BroadcastMessage)
    private broadcastRepository: Repository<BroadcastMessage>,

    @InjectRepository(User)
    private userRepostory: Repository<User>,
  ) {}
  async getAllBroadcasts(user: User): Promise<any> {
    const broadcasts = await this.broadcastRepository.find({
      where: { companyId: user.companyId },
      relations: ['users'], // Load the users relationship
      select: ['id', 'title', 'message', 'createdAt'], // Specify the fields you want to include
    });

    const userBroadcasts = broadcasts.map((broadcast) => {
      // Create a shallow copy of the broadcast without the 'users' property
      const { users, ...broadcastWithoutUsers } = broadcast;
      return broadcastWithoutUsers;
    });

    return userBroadcasts;
  }
}
