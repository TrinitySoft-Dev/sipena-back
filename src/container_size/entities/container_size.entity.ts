import { Rule } from '@/rules/entities/rule.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'container_sizes',
})
export class ContainerSize {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int',
    nullable: false,
  })
  value: number

  @OneToMany(() => Rule, rule => rule.container_size)
  rules: Rule[]

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
    comment: 'User avatar',
  })
  active: boolean

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
