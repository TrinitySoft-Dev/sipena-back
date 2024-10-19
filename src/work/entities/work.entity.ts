import { Container } from '@/container/entities/container.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'works',
})
export class Work {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  name: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  code: string

  @OneToMany(() => Rule, rule => rule.work)
  rules: Rule[]

  @OneToMany(() => Container, container => container.work)
  container: Container[]

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
