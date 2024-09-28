import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'conditions',
})
export class Condition {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ConditionGroup, conditionGroup => conditionGroup.conditions)
  @JoinColumn({ name: 'condition_group_id' })
  condition_group: ConditionGroup

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  field: string

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  operator: string

  @Column({
    type: 'varchar',
    length: 50,
  })
  value: string

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
