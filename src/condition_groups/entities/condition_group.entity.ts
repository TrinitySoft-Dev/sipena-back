import { Condition } from '@/conditions/entities/condition.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'condition_groups',
})
export class ConditionGroup {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Rule, rule => rule.id, { onDelete: 'CASCADE' })
  rule: Rule

  @OneToMany(() => Condition, condition => condition.condition_group, { onDelete: 'CASCADE' })
  conditions: Condition[]
}
