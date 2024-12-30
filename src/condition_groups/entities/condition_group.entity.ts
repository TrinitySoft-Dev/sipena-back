import { Condition } from '@/conditions/entities/condition.entity'
import { ExtraRule } from '@/extra_rules/entities/extra_rule.entity'
import { ExtraRulesWorker } from '@/extra_rules_workers/entities/extra_rules_worker.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { RulesWorker } from '@/rules_workers/entities/rules_worker.entity'
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'condition_groups',
})
export class ConditionGroup {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Rule, rule => rule.condition_groups)
  @JoinColumn({ name: 'rule_id' })
  rule: Rule

  @ManyToOne(() => ExtraRule, extraRule => extraRule.condition_groups)
  extra_rule: ExtraRule

  @ManyToOne(() => ExtraRulesWorker, extra_rule_worker => extra_rule_worker.condition_groups)
  extra_rule_workers: ExtraRulesWorker

  @RelationId((conditionGroup: ConditionGroup) => conditionGroup.rule)
  rule_id: number

  @ManyToOne(() => RulesWorker, rule_worker => rule_worker.condition_groups)
  @JoinColumn()
  rule_workers: RulesWorker

  @OneToMany(() => Condition, condition => condition.condition_group, { cascade: true, orphanedRowAction: 'delete' })
  conditions: Condition[]

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
