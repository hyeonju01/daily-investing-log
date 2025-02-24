import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  UseGuards,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { PurchaseHistoryService } from './purchase-history.service'
import { CreatePurchaseHistoryDto } from './dto/create-purchase-history.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { InvestingLogsService } from '../investing-logs/investing-logs.service'
import { AssetsService } from '../assets/assets.service'

@ApiTags('자산 추가')
@ApiBearerAuth()
@Controller('/investing-logs/{:logId}/purchase-history')
@UseGuards(JwtAuthGuard)
export class PurchaseHistoryController {
  private readonly logger = new Logger(PurchaseHistoryController.name)
  constructor(
    private readonly purchaseHistoryService: PurchaseHistoryService,
    private readonly investingLogService: InvestingLogsService,
    private readonly assetService: AssetsService,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Param('logId') logId: number,
    @Body() createPurchaseHistoryDto: CreatePurchaseHistoryDto,
  ) {
    this.logger.log(`📌 [POST] /purchase-history - 요청 수신`)
    if (!req || !req.user) {
      this.logger.warn(`⚠️ 인증 실패 - 유저 정보 없음`)
      throw new UnauthorizedException('User not authenticated')
    }

    const userId = req.user.id
    this.logger.log(`🔹 요청 유저: ${JSON.stringify(req.user)}`)
    this.logger.log(
      `🔹 요청 데이터: ${JSON.stringify(createPurchaseHistoryDto)}`,
    )

    const investingLog = await this.investingLogService.findOne(logId, userId)
    this.logger.log(`🔎 투자일지 조회: logId=${logId}`)
    if (!investingLog) {
      this.logger.error(`❌ 투자일지 조회 실패: 존재하지 않음`)
      throw new NotFoundException('Investing log does not exist')
    }

    this.logger.log(`🔎 자산 조회: assetId=${createPurchaseHistoryDto.assetId}`)
    const asset = await this.assetService.findOne(
      createPurchaseHistoryDto.assetId,
    )
    if (!asset) {
      this.logger.error(`❌ 자산 조회 실패: 존재하지 않음`)
      throw new NotFoundException('Investing log does not exist')
    }
    this.logger.log(`✅ 매수이력 생성 시작`)
    const result = await this.purchaseHistoryService.create(
      userId,
      logId,
      createPurchaseHistoryDto,
    )
    this.logger.log(`🎉 매수이력 생성 완료: ${JSON.stringify(result)}`)

    return result
  }

  /** ✅ 투자일지의 매수이력 목록 조회 */
  @Get('list')
  async findAll(@Req() req: any, @Param('logId') logId: number) {
    this.logger.log(`📌 [GET] /purchase-history/list - 요청 수신`)
    if (!req || !req.user) {
      this.logger.warn(`⚠️ 인증 실패 - 유저 정보 없음`)
      throw new UnauthorizedException('User not authenticated')
    }

    const userId = req.user.id
    this.logger.log(`🔹 요청 유저: ${JSON.stringify(req.user)}`)
    this.logger.log(`🔹 요청 투자일지 ID: ${logId}`)

    this.logger.log(`🔎 투자일지 조회: logId=${logId}`)
    const investingLog = await this.investingLogService.findOne(logId, userId)
    if (!investingLog) {
      this.logger.error(`❌ 투자일지 조회 실패`)

      throw new NotFoundException('Investing log does not exist')
    }
    this.logger.log(`🔎 매수이력 조회 시작`)

    const purchaseHistories = await this.purchaseHistoryService.findAllByLogId(
      userId,
      logId,
    )
    this.logger.log(
      `✅ 매수이력 조회 성공: ${JSON.stringify(purchaseHistories)}`,
    )

    if (!purchaseHistories.length) {
      this.logger.warn(`⚠️ 매수이력 없음: logId=${logId}`)
      throw new NotFoundException('매수이력이 존재하지 않습니다.')
    }
    this.logger.log(
      `✅ 매수이력 조회 성공: ${JSON.stringify(purchaseHistories)}`,
    )

    return purchaseHistories
    // return this.purchaseHistoryService.findAll()
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purchaseHistoryService.findOne(+id)
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePurchaseHistoryDto: UpdatePurchaseHistoryDto,
  // ) {
  //   return this.purchaseHistoryService.update(+id, updatePurchaseHistoryDto)
  // }

  /** ✅ 특정 매수이력 삭제 */
  @Delete(':historyId')
  async remove(
    @Req() req: any,
    @Param('logId') logId: number,
    @Param('historyId') historyId: number,
  ): Promise<{ message: string }> {
    this.logger.log(`📌 [DELETE] /purchase-history/${historyId} - 요청 수신`)
    if (!req || !req.user) {
      this.logger.warn(`⚠️ 인증 실패 - 유저 정보 없음`)
      throw new UnauthorizedException('User not authenticated')
    }

    const userId = req.user.id
    this.logger.log(`🔹 요청 유저: ${JSON.stringify(req.user)}`)
    this.logger.log(`🔹 요청 투자일지 ID: ${logId}, 매수이력 ID: ${historyId}`)
    this.logger.log(`🔎 투자일지 조회: logId=${logId}`)

    const investingLog = await this.investingLogService.findOne(logId, userId)
    this.logger.error(`❌ 투자일지 조회 실패`)
    if (!investingLog) {
      throw new NotFoundException('Investing log does not exist')
    }

    this.logger.log(`🔎 매수이력 조회: historyId=${historyId}`)
    const purchaseHistory = await this.purchaseHistoryService.findOne(historyId)
    if (!purchaseHistory) {
      this.logger.error(`❌ 매수이력 조회 실패`)
      throw new NotFoundException('purchaseHistory does not exist')
    }
    this.logger.log(`🗑️ 매수이력 삭제 시작`)

    await this.purchaseHistoryService.softDelete(userId, logId, historyId)
    this.logger.log(`✅ 매수이력 삭제 완료`)
    return { message: 'Purchase history successfully deleted' }
  }
}
