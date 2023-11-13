import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BroadcastService } from './broadcast.service';
import { AuthGuard } from '@nestjs/passport';
import { BroadcastMessage } from './broadcast.entity';
import { GetUser } from 'src/middleware/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('information')
@ApiTags('information')
export class BroadcastController {
  constructor(private broadcastService: BroadcastService) {}

  @Get('')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: '' })
  async getAllBroadcasts(@GetUser() user: User): Promise<BroadcastMessage[]> {
    return await this.broadcastService.getAllBroadcasts(user);
  }
}
