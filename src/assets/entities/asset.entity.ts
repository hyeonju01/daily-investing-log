import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  ticker: string

  @Column({ unique: true })
  asset_name: string

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  price: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
