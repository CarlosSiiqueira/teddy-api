import { Module } from '@nestjs/common';
import { UrlAccessController } from './url.access.controller';
import { UrlAccessService } from './url.access.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UrlAccessController],
  providers: [UrlAccessService],
  exports: [UrlAccessService]
})
export class UrlAccessModule { }
