import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { InvestingLog } from '../../investing-logs/entities/investing-log.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number // PK

  @Column({ unique: true }) // email 중복 불가
  email: string // 이메일

  @Column()
  password: string // 비밀번호

  @OneToMany(() => InvestingLog, (investingLog) => investingLog.user)
  investingLogs: InvestingLog[] // 투자일지

  @Column({ type: 'text', nullable: true })
  refresh_token?: string | null

  @CreateDateColumn() // 생성일
  created_at: Date

  @UpdateDateColumn() // 수정일
  updated_at: Date
}
