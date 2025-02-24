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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('투자일지')
@ApiBearerAuth()
@Controller('api/investing-logs')
@UseGuards(JwtAuthGuard)
export class InvestingLogsController {
  constructor(private readonly investingLogsService: InvestingLogsService) {}

  /**
   * 투자일지 생성
   */
  @Post('/new')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '투자일지 생성' })
  @ApiResponse({ status: 201 })
  async createInvestingLog(
    @Req() req: any,
    @Body() createInvestingLogDto: CreateInvestingLogDto,
  ) {
    const userId = req.user?.id
    if (!userId) {
      throw new UnauthorizedException('User not authenticated')
    }
    return this.investingLogsService.create(userId, createInvestingLogDto)
  }

  /**
   * 사용자의 모든 투자일지 조회
   */
  @Get('/list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자의 모든 투자일지를 조회합니다.' })
  @ApiResponse({ status: 201 })
  async getAllInvestingLogs(@Req() req: any) {
    return this.investingLogsService.findAllByUserId(req.user.id)
  }

  /**
   * 생성한 투자일지 조회
   */
  @Get(':logId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '투자일지를 조회합니다.' })
  @ApiResponse({ status: 201 })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자의 투자일지를 삭제합니다.' })
  @ApiResponse({ status: 201, description: '투자일지 삭제 성공' })
  async deleteInvestingLog(
    @Req() req: any,
    @Param('logId') logId: number,
  ): Promise<{ message: string }> {
    console.log(`📌 [DELETE] /investing-logs/${logId} - 요청 수신`)

    if (!req.user) {
      throw new UnauthorizedException('User not authenticated')
    }
    console.log(`🔹 요청 유저: ${JSON.stringify(req.user)}`)

    return await this.investingLogsService.softDelete(logId, req.user.id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInvestingLogDto: UpdateInvestingLogDto) {
  //   return this.investingLogsService.update(+id, updateInvestingLogDto);
  // }
}
