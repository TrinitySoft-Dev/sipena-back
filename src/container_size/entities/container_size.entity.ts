import { SelectedField } from '@/common/decorators/selected-fields.decorator'
import { Container } from '@/container/entities/container.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { RulesWorker } from '@/rules_workers/entities/rules_worker.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'container_sizes',
})
export class ContainerSize {
  @PrimaryGeneratedColumn()
  id: number

  @SelectedField()
  @Column({
    type: 'varchar',
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

  @OneToMany(() => Container, container => container.size)
  container: Container

  @OneToMany(() => RulesWorker, rules_worker => rules_worker.container_size)
  rules_worker: RulesWorker[]

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
