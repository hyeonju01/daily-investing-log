import { forwardRef, Module } from '@nestjs/common'
import { InvestingLogsService } from './investing-logs.service'
import { InvestingLogsController } from './investing-logs.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestingLog } from './entities/investing-log.entity'
import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { PurchaseHistory } from '../purchase-history/entities/purchase-history.entity'
import { PurchaseHistoryModule } from '../purchase-history/purchase-history.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([InvestingLog, PurchaseHistory]),
    forwardRef(() => UsersModule),
    forwardRef(() => PurchaseHistoryModule),
  ],
  controllers: [InvestingLogsController],
  providers: [InvestingLogsService],
  exports: [InvestingLogsService, TypeOrmModule],
})
export class InvestingLogsModule {}
