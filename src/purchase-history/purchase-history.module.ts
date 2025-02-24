import { Module } from '@nestjs/common'
import { PurchaseHistoryService } from './purchase-history.service'
import { PurchaseHistoryController } from './purchase-history.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PurchaseHistory } from './entities/purchase-history.entity'
import { InvestingLog } from '../investing-logs/entities/investing-log.entity'
import { Asset } from '../assets/entities/asset.entity'
import { User } from '../users/entities/user.entity'
import { InvestingLogsService } from '../investing-logs/investing-logs.service'
import { UsersService } from '../users/users.service'
import { AuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { AssetsService } from '../assets/assets.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseHistory, InvestingLog, Asset, User]), // ✅ User 추가
  ],
  controllers: [PurchaseHistoryController],
  providers: [
    PurchaseHistoryService,
    InvestingLogsService,
    UsersService,
    AuthService,
    JwtService,
    AssetsService,
  ],
  exports: [PurchaseHistoryService],
})
export class PurchaseHistoryModule {}
