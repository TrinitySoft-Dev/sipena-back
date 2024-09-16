import { User } from '@/users/entities/user.entity'
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

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
    nullable: false,
  })
  employment_end_date: Date

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

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  updated_at: Date

  @Column({
    nullable: true,
    type: 'date',
  })
  deleted_at: Date
}
