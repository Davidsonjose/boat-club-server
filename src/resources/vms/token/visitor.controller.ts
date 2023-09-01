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
  UserVisitPayload,
  VerifyActionParam,
  VerifyVisitDto,
  VerifyVisitPayload,
} from 'src/dto/token';
import { Visitor } from './visitor.entity';
import { VisitorService } from './visitor.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/middleware/get-user.decorator';
import { User } from 'src/resources/auth/user.entity';

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
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async createToken(
    @Body() createTokenDto: CreateTokenDto,
    @GetUser() user: User,
  ): Promise<Visitor> {
    return this.visitorService.createVisit(createTokenDto, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserVisitPayload })
  async getUserVisitor(@GetUser() user: User): Promise<Visitor[]> {
    return this.visitorService.getUserVisitor(user);
  }

  @Put('/cancel/:code')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async cancelVisit(@Param() code: string) {
    return this.visitorService.cancelVisit(code);
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
