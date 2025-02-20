import { Module } from '@nestjs/common';
import { InvestingLogsService } from './investing-logs.service';
import { InvestingLogsController } from './investing-logs.controller';

@Module({
  controllers: [InvestingLogsController],
  providers: [InvestingLogsService],
})
export class InvestingLogsModule {}
