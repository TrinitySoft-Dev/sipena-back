import { Timesheet } from '@/timesheet/entities/timesheet.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'timesheet_workers',
})
export class TimesheetWorker {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.timesheet_workers)
  worker: User

  @ManyToOne(() => Timesheet, timesheet => timesheet.timesheet_workers)
  timesheet: Timesheet

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  break: Date

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  waiting_time: Date

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  time: Date

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  time_out: Date

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  comment: string

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
