import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { ContainerSize } from '@/container_size/entities/container_size.entity'
import { ExtraRule } from '@/extra_rules/entities/extra_rule.entity'
import { User } from '@/users/entities/user.entity'
import { Work } from '@/work/entities/work.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'rules',
})
export class Rule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false,
    type: 'varchar',
    length: 80,
  })
  name: string

  @ManyToMany(() => ExtraRule, extraRule => extraRule.rules, { cascade: true })
  @JoinTable({
    name: 'rules_extra_rules',
    joinColumn: {
      name: 'rules_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'extra_rule_id',
      referencedColumnName: 'id',
    },
  })
  extra_rules: ExtraRule[]

  @ManyToOne(() => ContainerSize, containerSize => containerSize.rules, { cascade: true })
  container_size: ContainerSize

  @Column({
    nullable: false,
    type: 'decimal',
    comment: 'Rate of the container',
  })
  rate: number

  @ManyToMany(() => User, user => user.rules)
  customers: User[]

  @ManyToOne(() => Work, work => work.rules, { cascade: true })
  @JoinColumn()
  work: Work

  @OneToMany(() => ConditionGroup, group => group.rule, { cascade: true, orphanedRowAction: 'delete' })
  condition_groups: ConditionGroup[]

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
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
