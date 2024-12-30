import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { RulesWorker } from '@/rules_workers/entities/rules_worker.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'extra_rules_workers',
})
export class ExtraRulesWorker {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string

  @Column({
    type: 'float',
    nullable: false,
  })
  rate: number

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  rate_type: string

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  payment_type: string

  @OneToMany(() => ConditionGroup, group => group.extra_rule_workers, { cascade: true })
  condition_groups: ConditionGroup[]

  @ManyToMany(() => RulesWorker, rule => rule.extra_rules_worker)
  rule_worker: RulesWorker[]

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
  update_at: Date

  @DeleteDateColumn({
    type: 'timestamp',
  })
  delete_at: Date
}
