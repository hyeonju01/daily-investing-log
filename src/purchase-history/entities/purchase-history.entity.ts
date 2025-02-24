import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { InvestingLog } from '../../investing-logs/entities/investing-log.entity'
import { Asset } from '../../assets/entities/asset.entity'

@Entity()
export class PurchaseHistory {
  @PrimaryGeneratedColumn() // PK
  id: number

  @ManyToOne(() => User, (user) => user) // (FK) 회원 ID
  user: User

  @ManyToOne(
    // (FK) 투자일지 ID
    () => InvestingLog,
    (investingLog) => investingLog.purchaseHistories,
    // { nullable: true },
  )
  investingLog: InvestingLog

  @ManyToOne(() => Asset, (asset) => asset) // (FK) 자산 ID
  asset: Asset

  @Column() // 매수량
  purchaseVolume: number

  @Column() // 매수가격
  purchasePrice: number

  @CreateDateColumn({ type: 'timestamp' }) // 생성일
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' }) // 수정일
  updatedAt: Date

  @Column({ default: false })
  isDeleted: boolean
}
