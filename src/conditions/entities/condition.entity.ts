import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'conditions',
})
export class Condition {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ConditionGroup, conditionGroup => conditionGroup.conditions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'condition_group_id' })
  condition_group: ConditionGroup

  @RelationId((condition: Condition) => condition.condition_group)
  condition_group_id: number

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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_DATE',
    onUpdate: 'CURRENT_DATE',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'timestamp',
  })
  delete_at: Date
}
