import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UrlAccessModule } from 'src/url access/url.access.module';

@Module({
  imports: [PrismaModule, UrlAccessModule],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService]
})
export class UrlModule { }
