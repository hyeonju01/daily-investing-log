import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common'
import { InvestingLogsService } from './investing-logs.service'
import { CreateInvestingLogDto } from './dto/create-investing-log.dto'
import { UpdateInvestingLogDto } from './dto/update-investing-log.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('api/investing-logs')
@UseGuards(JwtAuthGuard)
export class InvestingLogsController {
  constructor(private readonly investingLogsService: InvestingLogsService) {}

  /**
   * 투자일지 생성
   */
  @Post()
  async createInvestingLog(
    @Req() req: any,
    @Body() createInvestingLogDto: CreateInvestingLogDto,
  ) {
    // console.log('req:', req)
    // console.log('req.user:', req.user)

    const userId = req.user?.id
    if (!userId) {
      throw new UnauthorizedException('User not authenticated')
    }
    return this.investingLogsService.create(userId, createInvestingLogDto)
  }

  /**
   * 사용자의 모든 투자일지 조회
   */
  @Get()
  async getAllInvestingLogs(@Req() req: any) {
    return this.investingLogsService.findAllByUserId(req.user.id)
  }

  /**
   * 생성한 투자일지 조회
   */
  @Get(':logId')
  async getInvestingLogById(
    @Req() req: any,
    @Param('logId', ParseIntPipe) logId: number,
  ) {
    // console.log('▶️ req.user:', req.user)
    // console.log('▶️ req.user.id:', req.user?.sub)
    return this.investingLogsService.findOne(logId, req.user.id)
  }

  /**
   * 투자일지 삭제
   */
  @Delete(':logId')
  async deleteInvestingLog(@Req() req: any, @Param('logId') logId: number) {
    return this.investingLogsService.deleteInvestingLog(logId, req.user.id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInvestingLogDto: UpdateInvestingLogDto) {
  //   return this.investingLogsService.update(+id, updateInvestingLogDto);
  // }
}
