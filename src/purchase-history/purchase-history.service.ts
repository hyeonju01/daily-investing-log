import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePurchaseHistoryDto } from './dto/create-purchase-history.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { PurchaseHistory } from './entities/purchase-history.entity'
import { Repository } from 'typeorm'
import { InvestingLog } from '../investing-logs/entities/investing-log.entity'
import { Asset } from '../assets/entities/asset.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class PurchaseHistoryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(PurchaseHistory)
    private readonly purchaseHistoryRepo: Repository<PurchaseHistory>,

    @InjectRepository(InvestingLog)
    private readonly investingLogRepo: Repository<InvestingLog>,

    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
  ) {}

  async create(
    userID: number,
    logId: number,
    // assetId: number,
    // purchasePrice: number,
    // quantity: number,
    createPurchaseHistoryDto: CreatePurchaseHistoryDto,
  ): Promise<PurchaseHistory> {
    const user = await this.userRepo.findOne({ where: { id: userID } })
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    const investingLog = await this.investingLogRepo.findOne({
      where: { id: logId },
    })
    if (!investingLog) {
      throw new NotFoundException('Investing log does not exist')
    }

    const asset = await this.assetRepo.findOne({
      where: { id: createPurchaseHistoryDto.assetId },
    })
    if (!asset) {
      throw new NotFoundException('Asset does not exist')
    }

    const purchasePrice = createPurchaseHistoryDto.purchasePrice
    const quantity = createPurchaseHistoryDto.purchasePrice

    const newPurchaseHistory = this.purchaseHistoryRepo.create({
      user,
      investingLog,
      asset,
      purchasePrice: createPurchaseHistoryDto.purchasePrice,
      purchaseVolume: createPurchaseHistoryDto.quantity,
      isDeleted: false, // Soft Delete를 위한 필드 추가
    })

    return this.purchaseHistoryRepo.save(newPurchaseHistory)
  }

  async findAllByLogId(
    userId: number,
    logId: number,
  ): Promise<PurchaseHistory[]> {
    const investingLog = await this.investingLogRepo.findOne({
      where: { id: logId },
    })
    if (!investingLog) {
      throw new NotFoundException('Investing log does not exist')
    }

    const purchaseHistories = await this.purchaseHistoryRepo.find({
      where: { investingLog: { id: logId }, isDeleted: false },
      relations: ['asset', 'investingLog', 'user'], // 🔹 연관된 엔티티 함께 조회
    })

    if (!purchaseHistories.length) {
      throw new NotFoundException('매수이력이 존재하지 않습니다.')
    }

    return purchaseHistories
  }

  async findOne(historyId: number): Promise<PurchaseHistory> {
    try {
      const purchaseHistory = await this.purchaseHistoryRepo.findOne({
        where: { id: historyId, isDeleted: false },
      })
      if (!purchaseHistory) {
        console.log(`error: ${historyId} 조회 실패`)
        throw new NotFoundException('Purchase history does not exist')
      }
      return purchaseHistory
    } catch (error) {
      console.log(`error: ${error}`)
      throw error
    }
  }

  // update(id: number, updatePurchaseHistoryDto: UpdatePurchaseHistoryDto) {
  //   return `This action updates a #${id} purchaseHistory`
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} purchaseHistory`
  // }

  /* 논리적 삭제 */
  async softDelete(
    userId: number,
    logId: number,
    historyId: number,
  ): Promise<{ message: string }> {
    const investingLog = await this.investingLogRepo.findOne({
      where: { id: logId, user: { id: userId } },
    })
    if (!investingLog) {
      throw new NotFoundException('Investing log does not exist')
    }

    const purchaseHistory = await this.purchaseHistoryRepo.findOne({
      where: { id: historyId, investingLog: { id: logId }, isDeleted: false },
    })
    if (!purchaseHistory) {
      throw new NotFoundException('Purchase history does not exist')
    }

    await this.purchaseHistoryRepo.update(historyId, { isDeleted: true })
    return { message: 'Purchase history successfully deleted' }
  }
}
