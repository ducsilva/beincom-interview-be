import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoUrl } from 'config/environment';
import { PostsModule } from './modules/posts/posts.module';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryMulterConfigService } from 'middleware';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './modules/auth/auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoUrl(), {
      autoCreate: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MulterModule.registerAsync({
      useClass: CloudinaryMulterConfigService,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
