import { RulesCondition } from '@/rules-conditions/entities/rules-condition.entity'
import { User } from '@/users/entities/user.entity'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'rules',
})
export class Rule {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  customer: User

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
  })
  status: boolean

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Type of the rule',
    length: 50,
    default: 'CONTAINER',
    enum: ['CONTAINER', 'PRODUCT'],
  })
  type: string

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

  @OneToMany(() => RulesCondition, rulesCondition => rulesCondition.rule, { onDelete: 'CASCADE' })
  conditions: RulesCondition[]

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
  })
  acitve: boolean

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
