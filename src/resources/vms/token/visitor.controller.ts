import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTokenDto,
  CreateVisitEventDto,
  UserVisitPayload,
  VerifyActionParam,
  VerifyVisitDto,
  VerifyVisitPayload,
} from 'src/dto/token';
import { VisitorService } from './visitor.service';
import { GetUser } from 'src/middleware/get-user.decorator';
import { HttpGuard } from 'src/middleware/http.guard';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User, Visitor, VmsEvent } from '@prisma/client';

@Controller('visitor')
@ApiTags('VMS (visitor management system)')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Post()
  @ApiOkResponse({
    description: 'Generating a code',
    schema: {
      properties: {
        status: { type: 'boolean' },
        message: { type: 'string' },

        nbHits: { type: 'number' },
      },
    },
  })
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async createToken(
    @Body() createTokenDto: CreateTokenDto,
    @GetUser() user: User,
  ): Promise<Visitor> {
    return this.visitorService.createVisit(createTokenDto, user);
  }

  @Post('/event')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async createEvent(
    @Body() createTokenDto: CreateVisitEventDto,
    @GetUser() user: User,
  ): Promise<VmsEvent> {
    return this.visitorService.createEventVisit(createTokenDto, user);
  }

  @Post('/inviteLimit')
  // @UseGuards(HttpGuard, AuthGuard)
  // @ApiOkResponse({ description: 'Successful' })
  async updateInviteLimit(): Promise<void> {
    return this.visitorService.updateInviteLimit(null);
  }
  @Get()
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful', type: UserVisitPayload })
  async getUserVisitor(
    @GetUser() user: User,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('status') status?: string, // Receive status as a query parameter
  ): Promise<Visitor[]> {
    const take = Math.max(1, Math.min(pageSize, 100)); // Limit pageSize to prevent large data fetches
    const skip = (page - 1) * take; // Calculate skip based on page

    return this.visitorService.getUserVisitor(user, take, skip, status);
  }

  @Get('/total')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful', type: UserVisitPayload })
  async getTotalVisitorCount(@GetUser() user: User): Promise<number> {
    return this.visitorService.getTotalVisitorCount(user);
  }

  @Get('/active')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful', type: UserVisitPayload })
  async getActiveVisit(@GetUser() user: User): Promise<number> {
    return this.visitorService.getActiveVisit(user);
  }

  @Get('/qr-code')
  // @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async getQrCode(@Query('code') code: string): Promise<string> {
    return this.visitorService.getQrCode(code);
  }

  @Get('/event')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful', type: '' })
  async getVmsEvents(@GetUser() user: GetUserDto): Promise<VmsEvent[]> {
    return this.visitorService.getUserVmsEvents(user);
  }

  @Get('/event/details/:eventId')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful', type: '' })
  async getVmsEventDetails(
    @GetUser() user: GetUserDto,
    @Param('eventId') eventId: number,
  ): Promise<VmsEvent> {
    return this.visitorService.getSingleVmsEvent(eventId);
  }

  @Get('this-week')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful', type: UserVisitPayload })
  async getVisitsThisWeek(@GetUser() user: GetUserDto): Promise<any> {
    return this.visitorService.calculateWeeklyCheckInGrowth(user);
  }

  @Put('/cancel/:code')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async cancelVisit(@Param() code: string) {
    return this.visitorService.cancelVisit(code);
  }

  @Put('/push')
  // @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async trestes(@Param() code: string) {
    return this.visitorService.handleEvent();
  }

  @Post('/verify')
  @ApiOkResponse({ description: 'Successful', type: VerifyVisitPayload })
  async verifyVisit(
    @Body() verifyVisitDto: VerifyVisitDto,
    @Query() verifyActionParam: VerifyActionParam,
  ) {
    return await this.visitorService.verifyVisit(
      verifyVisitDto,
      verifyActionParam,
    );
  }

  // @UseGuards()

  // @Put()
  // @ApiOkResponse({
  //   description: 'Updating a code status',
  //   schema: {
  //     properties: {
  //       status: { type: 'boolean' },
  //       message: { type: 'string' },
  //       payload: {
  //         type: 'array',
  //         items: {
  //           // Reference to your model definition
  //         },
  //       },
  //       nbHits: { type: 'number' },
  //     },
  //   },
  // })
  // async updateCodeStatus(
  //   @Body() updateTokenStatus: updateTokenStatus,
  // ): Promise<[]> {
  //   return this.tokenService.updateCodeStatus(updateTokenStatus);
  // }
}
