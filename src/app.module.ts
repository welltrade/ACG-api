import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { UserInterceptor } from "./user/interceptors/user.interceptor";
import { AuthGuard } from "./guards/auth.guard";

@Module({
  imports: [ProductModule, UserModule, PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
      {
        provide: APP_INTERCEPTOR,
        useClass: UserInterceptor
      },
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
      }
    ],
})
export class AppModule {}
