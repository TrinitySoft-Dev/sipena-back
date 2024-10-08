import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'password_hashes',
})
export class PasswordHash {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
    length: 64,
    unique: true,
  })
  token: string

  @Column({ type: 'timestamp', nullable: false })
  expires: Date

  @CreateDateColumn({ type: 'timestamp', comment: 'Timesheet created at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', comment: 'Timesheet updated at' })
  updated_at: Date
}
