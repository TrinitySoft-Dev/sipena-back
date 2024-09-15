import { Container } from '@/container/entities/container.entity'
import { User } from '@/users/entities/user.entity'
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'time_sheets',
})
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => User, user => user.id, { onDelete: 'CASCADE' })
  customer: number

  @Column({
    nullable: false,
    type: 'date',
  })
  day: Date

  @Column({
    nullable: false,
    type: 'date',
  })
  week: Date

  @OneToOne(() => Container, container => container.id, { onDelete: 'CASCADE' })
  container: Container

  @OneToMany(() => User, user => user.id, { onDelete: 'CASCADE' })
  workers: User[]

  @Column('varchar', { array: true })
  images: string[]

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Comments of the timesheet',
    nullable: true,
  })
  comments: string

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
  })
  active: boolean

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
    comment: 'Timesheet created at',
  })
  created_at: Date

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
    comment: 'Timesheet updated at',
  })
  updated_at: Date

  @Column({
    type: 'date',
    comment: 'Timesheet deleted at',
  })
  deleted_at: Date
}
