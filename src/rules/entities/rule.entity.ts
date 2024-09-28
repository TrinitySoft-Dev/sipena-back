import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { ContainerSize } from '@/container_size/entities/container_size.entity'
import { User } from '@/users/entities/user.entity'
import { Work } from '@/work/entities/work.entity'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

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

  @OneToOne(() => ContainerSize, containerSize => containerSize.rule, { cascade: true })
  container_size: ContainerSize

  @Column({
    nullable: false,
    type: 'decimal',
    comment: 'Rate of the container',
  })
  rate: number

  @ManyToMany(() => User, user => user.rules)
  customers: User[]

  @ManyToOne(() => Work, work => work.rules)
  @JoinColumn({ name: 'work_id' })
  work: Work

  @OneToMany(() => ConditionGroup, group => group.rule, { cascade: true })
  condition_groups: ConditionGroup[]

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
