import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'info_workers',
})
export class Infoworker {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 30,
  })
  phone: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 9,
  })
  tfn: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 11,
  })
  abn: string

  @Column({
    type: 'date',
    nullable: false,
  })
  birthday: Date

  @Column({
    type: 'date',
    nullable: true,
  })
  employment_start_date: Date

  @Column({
    type: 'varchar',
    nullable: false,
    length: 128,
  })
  passport_url: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  address: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  city: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 40,
  })
  bank_name: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 80,
  })
  bank_account_name: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 12,
  })
  bank_account_number: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 80,
  })
  bsb: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 128,
  })
  visa_url: string

  @OneToOne(() => User, user => user.infoworker)
  user: User

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_DATE',
    onUpdate: 'CURRENT_DATE',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'timestamp',
  })
  delete_at: Date
}
