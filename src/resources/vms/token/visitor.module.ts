import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerateRandom } from 'src/helpers/generate-random';
import { CompanyModule } from 'src/resources/company/company.module';
import { Visitor } from './visitor.entity';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visitor]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CompanyModule,
  ],
  controllers: [VisitorController],
  providers: [VisitorService, GenerateRandom],
  exports: [VisitorService],
})
export class VisitorModule {}
