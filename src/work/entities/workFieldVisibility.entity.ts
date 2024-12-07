import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Work } from './work.entity'
import { WorkField } from '@/work_fields/entities/work_field.entity'

@Entity({
  name: 'work_field_visibilities',
})
export class WorkFieldVisibility {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Work, work => work.workFieldVisibilities)
  work: Work

  @ManyToOne(() => WorkField, field => field.workFieldVisibilities)
  field: WorkField

  @Column({ type: 'boolean', default: true })
  isVisible: boolean

  @Column({
    type: 'int',
    nullable: true,
  })
  position: number
}
