import { Condition } from '@/conditions/entities/condition.entity'
import { ExtraRule } from '@/extra_rules/entities/extra_rule.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm'

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

  @RelationId((conditionGroup: ConditionGroup) => conditionGroup.rule)
  rule_id: number

  @OneToMany(() => Condition, condition => condition.condition_group, { cascade: true, orphanedRowAction: 'delete' })
  conditions: Condition[]
}
