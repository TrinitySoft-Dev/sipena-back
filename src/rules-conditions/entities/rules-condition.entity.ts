import { Rule } from '@/rules/entities/rule.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'rules_conditions',
})
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
    type: 'boolean',
    default: true,
  })
  active: boolean

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  updated_at: Date

  @Column({
    nullable: true,
    type: 'date',
  })
  deleted_at: Date
}
