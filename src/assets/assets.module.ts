import { Module } from '@nestjs/common'
import { AssetsService } from './assets.service'
import { AssetsController } from './assets.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestingLog } from '../investing-logs/entities/investing-log.entity'
import { Asset } from './entities/asset.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
