// NestJS Main (전체 애플리케이션 관리)
import { config } from 'dotenv'

config({ path: '.env.staging' })

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDatabaseConfig } from './config/database.config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { AssetsModule } from './assets/assets.module'
import { InvestingLogsModule } from './investing-logs/investing-logs.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      envFilePath: '.env.staging',
      // envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UsersModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UsersModule,
    AuthModule,
    AssetsModule,
    InvestingLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
