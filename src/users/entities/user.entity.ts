import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

// 회원 ID, 이메일, 비밀번호, 생성일, 수정일, 리프레쉬 토큰
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true }) // email 중복 불가
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  refresh_token?: string | null

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
