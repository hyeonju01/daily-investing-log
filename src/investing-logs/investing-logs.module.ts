import { forwardRef, Module } from '@nestjs/common'
import { InvestingLogsService } from './investing-logs.service'
import { InvestingLogsController } from './investing-logs.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestingLog } from './entities/investing-log.entity'
import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([InvestingLog]),
    forwardRef(() => UsersModule),
  ],
  controllers: [InvestingLogsController],
  providers: [InvestingLogsService],
  exports: [InvestingLogsService, TypeOrmModule],
})
export class InvestingLogsModule {}
