import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UserInterceptor } from "./user/interceptors/user.interceptor";

@Module({
  imports: [ProductModule, UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
  }],
})
export class AppModule {}
