import { Container } from '@/container/entities/container.entity'
import { TimesheetWorker } from '@/timesheet_workers/entities/timesheet_worker.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'time_sheets',
})
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.timesheets)
  customer: User

  @Column({
    nullable: false,
    type: 'date',
  })
  day: Date

  @Column({
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  week: String

  @OneToOne(() => Container)
  @JoinColumn()
  container: Container

  @OneToMany(() => TimesheetWorker, timesheetWorker => timesheetWorker.timesheet, { cascade: true })
  timesheet_workers: TimesheetWorker[]

  @Column('varchar', { array: true })
  images: string[]

  @Column({
    nullable: false,
    type: 'decimal',
    comment: 'Base rate of the timesheet',
  })
  base: number

  @Column({
    nullable: false,
    type: 'decimal',
    comment: 'Rate of the timesheet',
  })
  rate: number

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
  })
  active: boolean

  @Column({
    type: 'json',
    nullable: true,
  })
  extra_rates: any

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
