import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity()
export class InvestingLog {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user: User) => user)
  // @JoinColumn({ name: 'userId' })
  user: User

  @Column({ name: 'userId', nullable: false })
  userId: number

  @Column({ type: 'text' })
  title: string

  @Column({ type: 'text' })
  contents: string

  @Column({ type: 'date' })
  investingDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
