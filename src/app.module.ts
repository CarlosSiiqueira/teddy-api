import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { AuthenticationModule } from './middlewares/authentication.module';
import { UrlModule } from './url/url.module';
import { UrlAccessModule } from './url access/url.access.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthenticationModule,
    UrlModule,
    UrlAccessModule
  ]
})

export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }

}
