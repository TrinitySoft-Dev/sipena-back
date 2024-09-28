import { Condition } from '@/conditions/entities/condition.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'condition_groups',
})
export class ConditionGroup {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Rule, rule => rule.condition_groups)
  @JoinColumn({ name: 'rule_id' })
  rule: Rule

  @OneToMany(() => Condition, condition => condition.condition_group, { cascade: true })
  conditions: Condition[]
}
