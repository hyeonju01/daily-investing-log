import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { PurchaseHistory } from '../../purchase-history/entities/purchase-history.entity'

@Entity()
export class InvestingLog {
  @PrimaryGeneratedColumn() // PK
  id: number

  @ManyToOne(() => User, (user) => user.investingLogs, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'userId' })
  user: User // (FK) 회원 ID

  // @Column({ name: 'userId', nullable: false })
  // userId: number

  @OneToMany(
    () => PurchaseHistory,
    (purchaseHistory) => purchaseHistory.investingLog,
    { cascade: true },
  ) // 매수이력
  purchaseHistories: PurchaseHistory[]

  @Column({ type: 'text' }) // 투자일지 제목
  title: string

  @Column({ type: 'text' }) // 투자일지 내용
  contents: string

  @Column({ type: 'date' }) // 매수일
  investingDate: Date

  @CreateDateColumn() // 생성일
  createdAt: Date

  @UpdateDateColumn() // 수정일
  updatedAt: Date

  @Column({ default: false })
  isDeleted: boolean
}
