import {
  Delete,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { CreateInvestingLogDto } from './dto/create-investing-log.dto'
import { UpdateInvestingLogDto } from './dto/update-investing-log.dto'
import { InvestingLog } from './entities/investing-log.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'

@Injectable()
export class InvestingLogsService {
  constructor(
    @InjectRepository(InvestingLog)
    private investingLogRepository: Repository<InvestingLog>,
    private userService: UsersService,
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
      where: { user: { id: userId } },
      relations: ['user'],
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

    if (!investingLog) {
      throw new NotFoundException(`투자일지(id: ${userId})를 찾을 수 없습니다.`)
    }

    if (investingLog.user.id !== userId) {
      throw new ForbiddenException('본인 투자일지만 조회 가능합니다.')
    }

    return investingLog
  }

  /**
   * 투자일지 삭제
   */
  async deleteInvestingLog(logId: number, userId: number): Promise<void> {
    const investingLog = await this.findOne(logId, userId)
    await this.investingLogRepository.remove(investingLog)
  }

  // update(id: number, updateInvestingLogDto: UpdateInvestingLogDto) {
  //   return `This action updates a #${id} investingLog`;
  // }
}
