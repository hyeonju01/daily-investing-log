import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateInvestingLogDto } from './dto/create-investing-log.dto'
import { InvestingLog } from './entities/investing-log.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { PurchaseHistory } from '../purchase-history/entities/purchase-history.entity'

@Injectable()
export class InvestingLogsService {
  constructor(
    @InjectRepository(InvestingLog)
    private readonly investingLogRepository: Repository<InvestingLog>,

    @InjectRepository(PurchaseHistory)
    private readonly purchaseHistoryRepository: Repository<PurchaseHistory>,

    private readonly userService: UsersService,
  ) {}

  /**
   * 투자일지 작성
   */
  async create(
    userId: number,
    dto: CreateInvestingLogDto,
  ): Promise<InvestingLog> {
    const user: User = await this.userService.findById(userId)
    console.log(user)
    const investingLog = this.investingLogRepository.create({
      user: user,
      title: dto.title,
      contents: dto.contents,
      investingDate: new Date(String(dto.investingDate)),
    })
    console.log('investing log: ', investingLog)
    await this.investingLogRepository.save(investingLog)

    return investingLog
  }

  /**
   * 투자일지 목록 조회
   */
  async findAllByUserId(userId: number): Promise<InvestingLog[]> {
    return this.investingLogRepository.find({
      where: { user: { id: userId }, isDeleted: false },
    })
  }

  /**
   * 투자일지 단건 조회
   */
  async findOne(logId: number, userId: number): Promise<InvestingLog> {
    const investingLog = await this.investingLogRepository.findOne({
      where: { id: logId },
      relations: ['user'],
    })
    // console.log('investing log: ', investingLog)
    if (!investingLog) {
      throw new NotFoundException(`투자일지(id: ${logId})를 찾을 수 없습니다.`)
    }

    if (investingLog.user.id !== userId) {
      throw new ForbiddenException('본인 투자일지만 조회 가능합니다.')
    }

    return investingLog
  }

  /**
   * 투자일지 삭제 (soft Delete)
   */
  async softDelete(
    logId: number,
    userId: number,
  ): Promise<{ message: string }> {
    console.log(`🔎 softDelete 실행됨: logId=${logId}, userId=${userId}`)

    // 요청 사용자 확인
    const user: User = await this.userService.findById(userId)
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    // 투자일지 확인
    const investingLog = await this.investingLogRepository.findOne({
      where: { id: logId },
      relations: ['user'],
    })

    if (!investingLog) {
      console.log(`✅ Found InvestingLog:`, investingLog)
      throw new NotFoundException('Investing log does not exist')
    }
    console.log(`🚨investingLog.user.id:`, investingLog.user?.id)

    // 요청 사용자가 해당 투자일지를 소유하고 있는지 확인
    if (investingLog.user.id !== userId) {
      throw new ForbiddenException('You do not own this investing log')
    }

    // 투자일지에 연결된 모든 매수이력을 Soft Delete
    await this.purchaseHistoryRepository.update(
      { investingLog: { id: logId } },
      { isDeleted: true },
    )

    // 투자일지 Soft Delete
    await this.investingLogRepository.update(logId, { isDeleted: true })
    return { message: 'Investing log successfully soft deleted' }
  }

  // /**
  //  * 투자일지 삭제 (Hard Delete)
  //  */
  // async deleteInvestingLog(logId: number, userId: number): Promise<void> {
  //   const investingLog = await this.findOne(logId, userId)
  //   await this.investingLogRepository.remove(investingLog)
  // }

  // update(id: number, updateInvestingLogDto: UpdateInvestingLogDto) {
  //   return `This action updates a #${id} investingLog`;
  // }
}
