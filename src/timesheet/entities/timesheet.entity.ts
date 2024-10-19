import { Container } from '@/container/entities/container.entity'
import { TimesheetWorker } from '@/timesheet_workers/entities/timesheet_worker.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
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
    comment: 'Rate of the timesheet',
  })
  rate: number

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

  @CreateDateColumn({ type: 'timestamp', comment: 'Timesheet created at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', comment: 'Timesheet updated at' })
  updated_at: Date

  @Column({
    type: 'timestamp',
    comment: 'Timesheet deleted at',
    nullable: true,
  })
  deleted_at: Date
}
