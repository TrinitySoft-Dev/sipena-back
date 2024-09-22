import { ConditionGroup } from '@/condition_groups/entities/condition_group.entity'
import { User } from '@/users/entities/user.entity'
import { Work } from '@/work/entities/work.entity'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column({
    nullable: false,
    type: 'decimal',
    comment: 'Size of the container',
  })
  container_size: number

  @Column({
    nullable: false,
    type: 'decimal',
    comment: 'Rate of the container',
  })
  rate: number

  @ManyToMany(() => User, user => user.rules)
  users: User[]

  @ManyToOne(() => Work, work => work.rules)
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
