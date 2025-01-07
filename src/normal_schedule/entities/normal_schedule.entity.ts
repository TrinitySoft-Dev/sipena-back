import { Overtime } from '@/overtimes/entities/overtime.entity'
import { User } from '@/users/entities/user.entity'
import { Work } from '@/work/entities/work.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'normal_schedule',
})
export class NormalSchedule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string

  @ManyToOne(() => Work, work => work.normal_schedule, { cascade: true })
  work: Work

  @Column('text', { array: true })
  days: string[]

  @Column({
    type: 'int',
    nullable: false,
  })
  up_hours: number

  @Column({
    type: 'float',
    nullable: false,
  })
  rate: number

  @ManyToMany(() => User, user => user.normal_schedule)
  @JoinTable({
    joinColumn: {
      name: 'normal_schedule_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'customer_id',
      referencedColumnName: 'id',
    },
  })
  customer: User[]

  @ManyToMany(() => Overtime, overtime => overtime.normal_schedules)
  @JoinTable({
    joinColumn: {
      name: 'normal_schedule_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'overtime_id',
      referencedColumnName: 'id',
    },
  })
  overtimes: Overtime[]

  @Column({
    type: 'boolean',
    nullable: false,
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
