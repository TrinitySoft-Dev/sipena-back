import { SelectedField } from '@/common/decorators/selected-fields.decorator'
import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { Rule } from '@/rules/entities/rule.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'extra_rules',
})
export class ExtraRule {
  @PrimaryGeneratedColumn()
  id: number

  @SelectedField()
  @Column({
    type: 'varchar',
    nullable: false,
    length: 60,
  })
  name: string

  @OneToMany(() => ConditionGroup, group => group.extra_rule, { cascade: true })
  condition_groups: ConditionGroup[]

  @ManyToMany(() => Rule, rule => rule.extra_rules)
  rules: Rule[]

  @SelectedField()
  @Column({
    type: 'decimal',
    nullable: false,
  })
  rate: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
    comment: 'Tipo de tarfia: porcentaje, fijo, por unidad',
  })
  rate_type: string

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Unidad de medida para el cargo: sku, pallet, etc.',
  })
  unit: string

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indicates if the rule is active',
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
  updated_at: Date

  @DeleteDateColumn({
    type: 'timestamp',
  })
  delete_at: Date
}
