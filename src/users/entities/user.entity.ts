import {
  Column,
  CreateDateColumn,
  Entity,
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
  refresh_token?: string | null // 리프레쉬 토큰

  /* 회원가입 시 이메일 인증 관련 필드 */
  @Column({ nullable: true })
  emailVerificationToken: string | null // 이메일 인증 토큰

  @Column({ default: false })
  isEmailVerified: boolean // 이메일 인증 여부

  /* 비밀번호 재설정 시 이메일 인증 관련 필드 */
  @Column({ nullable: true })
  passwordResetToken: string | null

  @Column({ nullable: true, type: 'timestamp' })
  passwordResetExpires: Date | null

  @CreateDateColumn() // 생성일
  created_at: Date

  @UpdateDateColumn() // 수정일
  updated_at: Date
}
