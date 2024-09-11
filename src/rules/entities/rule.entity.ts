import { RulesCondition } from '@/rules-conditions/entities/rules-condition.entity'
import { User } from '@/users/entities/user.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => User, user => user.id, { onDelete: 'CASCADE' })
  customer: User

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

  @OneToMany(() => RulesCondition, rulesCondition => rulesCondition.rule, { onDelete: 'CASCADE' })
  conditions: RulesCondition[]
}
