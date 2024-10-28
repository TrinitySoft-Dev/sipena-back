import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
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

  @Column({
    type: 'varchar',
    nullable: false,
    length: 60,
  })
  name: string

  @ManyToMany(() => User, user => user.extra_rules)
  customers: User[]

  @OneToMany(() => ConditionGroup, group => group.extra_rule, { cascade: true })
  condition_groups: ConditionGroup[]

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
    type: 'int',
    nullable: true,
    comment: 'Límite para la unidad especificada',
  })
  limit: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: string

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: string
}
