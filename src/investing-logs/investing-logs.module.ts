import { Module } from '@nestjs/common'
import { InvestingLogsService } from './investing-logs.service'
import { InvestingLogsController } from './investing-logs.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestingLog } from './entities/investing-log.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([InvestingLog]), UsersModule],
  controllers: [InvestingLogsController],
  providers: [InvestingLogsService],
  exports: [InvestingLogsService],
})
export class InvestingLogsModule {}
