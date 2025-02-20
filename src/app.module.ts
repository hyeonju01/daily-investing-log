// NestJS Main (전체 애플리케이션 관리)

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          cache: false,
          // envFilePath: `.env.${process.env.NODE_ENV || 'test'}`,
          envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: getDatabaseConfig,
      }),
      UsersModule,
      AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
