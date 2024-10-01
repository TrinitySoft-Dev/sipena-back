import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { ContainerSize } from '@/container_size/entities/container_size.entity'
import { User } from '@/users/entities/user.entity'
import { Work } from '@/work/entities/work.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
    type: 'boolean',
    default: false,
  })
  status: boolean

  @ManyToOne(() => ContainerSize, containerSize => containerSize.rules)
  @JoinColumn()
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
  })
  updated_at: Date

  @Column({
    nullable: true,
    type: 'date',
  })
  deleted_at: Date
}
