import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Infoworker {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  phone: string

  @Column()
  tfn: string

  @Column()
  abn: string

  @Column()
  birthday: string

  @Column()
  employment_end_date: string

  @Column()
  passport: string

  @Column()
  address: string

  @Column()
  city: string

  @Column({
    default: true,
  })
  active: boolean

  @Column()
  visa: string

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
    nullable: false,
    type: 'date',
  })
  deleted_at: Date
}
