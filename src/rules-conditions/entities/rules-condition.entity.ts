import { Rule } from '@/rules/entities/rule.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

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
}
