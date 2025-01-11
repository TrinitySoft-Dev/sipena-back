import { SelectedField } from '@/common/decorators/selected-fields.decorator'
import { Infoworker } from '@/infoworkers/entities/infoworker.entity'
import { NormalSchedule } from '@/normal_schedule/entities/normal_schedule.entity'
import { Product } from '@/products/entities/product.entity'
import { Role } from '@/roles/entities/role.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { Timesheet } from '@/timesheet/entities/timesheet.entity'
import { TimesheetWorker } from '@/timesheet_workers/entities/timesheet_worker.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    nullable: false,
    type: 'varchar',
    comment: 'User email',
  })
  @SelectedField()
  email: string

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'User password',
  })
  password: string

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'User name',
  })
  @SelectedField()
  name: string

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'User lastname',
  })
  @SelectedField()
  last_name: string

  @OneToOne(() => Infoworker, infoworker => infoworker.user, { cascade: true })
  @JoinColumn()
  infoworker: Infoworker

  @ManyToOne(() => Role, role => role.users, { cascade: true })
  role: Role

  @Column({
    type: 'varchar',
    comment: 'User avatar',
    nullable: true,
    length: 100,
  })
  avatar: string

  @ManyToMany(() => Rule, rule => rule.customers, { cascade: true })
  @JoinTable({
    name: 'customers_rules',
    joinColumn: {
      name: 'customer_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rule_id',
      referencedColumnName: 'id',
    },
  })
  rules: Rule[]

  @OneToMany(() => Timesheet, timesheet => timesheet.customer)
  timesheets: Timesheet[]

  @OneToMany(() => TimesheetWorker, timesheetWorker => timesheetWorker.worker)
  timesheet_workers: TimesheetWorker[]

  @ManyToMany(() => Product, product => product.customers)
  @JoinTable()
  products: Product[]

  @ManyToMany(() => NormalSchedule, normalSchedule => normalSchedule.customer, { cascade: true })
  normal_schedule: NormalSchedule[]

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Field to check if the user has completed the registration',
  })
  completed: boolean

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
    comment: 'User avatar',
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
