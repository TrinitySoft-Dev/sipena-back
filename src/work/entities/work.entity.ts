import { SelectedField } from '@/common/decorators/selected-fields.decorator'
import { Container } from '@/container/entities/container.entity'
import { Rule } from '@/rules/entities/rule.entity'
import { RulesWorker } from '@/rules_workers/entities/rules_worker.entity'
import { WorkField } from '@/work_fields/entities/work_field.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { WorkFieldVisibility } from './workFieldVisibility.entity'

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
  @SelectedField()
  name: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  @SelectedField()
  code: string

  @OneToMany(() => Rule, rule => rule.work)
  rules: Rule[]

  @OneToMany(() => RulesWorker, rules_worker => rules_worker.work)
  rules_worker: RulesWorker[]

  @OneToMany(() => Container, container => container.work)
  container: Container[]

  @OneToMany(() => WorkFieldVisibility, wfv => wfv.work, { cascade: true })
  workFieldVisibilities: WorkFieldVisibility[]

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
    comment: 'User avatar',
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
