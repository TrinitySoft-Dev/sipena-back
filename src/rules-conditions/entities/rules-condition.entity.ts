import { Rule } from '@/rules/entities/rule.entity'
import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class RulesCondition {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Rule, rule => rule.conditions, { onDelete: 'CASCADE' })
  rule: Rule

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'Field name',
    length: 50,
  })
  field: string

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'Operator',
    length: 30,
  })
  operator: string

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'Value',
    length: 50,
  })
  value: string

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'Condition type',
    length: 5,
  })
  @Check(`"condition_type" IN ('and', 'or')`)
  condition_type: string
}
