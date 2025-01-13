import { City } from '@/city/entities/city.entity'
import { State } from '@/state/entities/state.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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
    length: 50,
  })
  tfn: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
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

  @ManyToOne(() => City, city => city.infoworkers)
  city: City

  @ManyToOne(() => State, state => state.infoworkers)
  state: State

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
    length: 50,
  })
  bank_account_number: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
  })
  postal_code: string

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
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'timestamp',
  })
  delete_at: Date
}
