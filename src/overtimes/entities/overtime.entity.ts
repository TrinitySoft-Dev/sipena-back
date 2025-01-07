import { NormalSchedule } from '@/normal_schedule/entities/normal_schedule.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'overtimes',
})
export class Overtime {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string

  @Column({
    type: 'int',
    nullable: false,
  })
  number: number

  @Column({
    type: 'int',
    nullable: false,
  })
  hours: number

  @Column({
    type: 'float',
    nullable: false,
  })
  rate: number

  @ManyToMany(() => NormalSchedule, normal_schedule => normal_schedule.overtimes)
  normal_schedules: NormalSchedule[]

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
