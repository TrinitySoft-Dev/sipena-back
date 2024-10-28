import { ExtraRule } from '@/extra_rules/entities/extra_rule.entity'
import { Infoworker } from '@/infoworkers/entities/infoworker.entity'
import { Product } from '@/products/entities/product.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { Timesheet } from '@/timesheet/entities/timesheet.entity'
import { TimesheetWorker } from '@/timesheet_workers/entities/timesheet_worker.entity'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

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
  name: string

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'User lastname',
  })
  last_name: string

  @OneToOne(() => Infoworker, infoworker => infoworker.user, { cascade: true })
  @JoinColumn()
  infoworker: Infoworker

  @Column({
    type: 'varchar',
    comment: 'User role',
    length: 50,
    nullable: false,
    enum: ['WORKER', 'CLIENT'],
    default: 'WORKER',
  })
  role: string

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

  @ManyToMany(() => ExtraRule, extraRule => extraRule.customers, { cascade: true })
  @JoinTable({
    name: 'customers_extra_rules',
    joinColumn: {
      name: 'customer_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'extra_rule_id',
      referencedColumnName: 'id',
    },
  })
  extra_rules: ExtraRule[]

  @OneToMany(() => Timesheet, timesheet => timesheet.customer)
  timesheets: Timesheet[]

  @OneToMany(() => TimesheetWorker, timesheetWorker => timesheetWorker.worker)
  timesheet_workers: TimesheetWorker[]

  @ManyToMany(() => Product, product => product.customers)
  @JoinTable()
  products: Product[]

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

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  updated_at: Date

  @Column({
    type: 'date',
    nullable: true,
  })
  deleted_at: Date
}
