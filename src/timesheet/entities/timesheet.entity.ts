import { SelectedField } from '@/common/decorators/selected-fields.decorator'
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

export enum TimesheetStatusEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity({
  name: 'time_sheets',
})
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.timesheets)
  @SelectedField({
    relation: () => User,
  })
  customer: User

  @Column({
    nullable: false,
    type: 'date',
  })
  @SelectedField()
  day: Date

  @Column({
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  @SelectedField()
  week: String

  @OneToOne(() => Container, { cascade: true })
  @JoinColumn()
  @SelectedField({
    relation: () => Container,
  })
  container: Container

  @OneToMany(() => TimesheetWorker, timesheetWorker => timesheetWorker.timesheet, { cascade: true })
  timesheet_workers: TimesheetWorker[]

  @Column('varchar', { array: true })
  images: string[]

  @SelectedField()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  item_code: string

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
  @SelectedField()
  rate: number

  @Column({
    type: 'enum',
    enum: TimesheetStatusEnum,
    default: TimesheetStatusEnum.OPEN,
  })
  status_customer_pay: TimesheetStatusEnum

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
