import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { ContainerSize } from '@/container_size/entities/container_size.entity'
import { ExtraRulesWorker } from '@/extra_rules_workers/entities/extra_rules_worker.entity'
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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'rules_worker',
})
export class RulesWorker {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string

  @ManyToOne(() => ContainerSize, container_size => container_size.rules_worker)
  container_size: ContainerSize

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

  @ManyToOne(() => Work, work => work.rules_worker, { cascade: true })
  @JoinColumn()
  work: Work

  @ManyToMany(() => ExtraRulesWorker, extraRuleWorker => extraRuleWorker.rule_worker)
  @JoinTable({
    name: 'rules_worker_extra_rules_worker',
    joinColumn: {
      name: 'rules_worker_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'extra_rules_worker_id',
      referencedColumnName: 'id',
    },
  })
  extra_rules_worker: ExtraRulesWorker[]

  @OneToMany(() => ConditionGroup, group => group.rule_workers, { cascade: true, orphanedRowAction: 'delete' })
  condition_groups: ConditionGroup[]

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
