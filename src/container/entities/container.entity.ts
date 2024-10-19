import { OPERATORS } from '@/common/conts/operators'
import { ConditionField } from '@/common/decorators/condition-field.decorator'
import { Work } from '@/work/entities/work.entity'
import { IsBoolean } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'containers',
})
export class Container {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 40,
    comment: 'Container number',
  })
  container_number: string

  @ManyToOne(() => Work, work => work.container)
  work: Work

  @ConditionField({
    open: true,
  })
  @Column({
    type: 'integer',
    nullable: false,
  })
  size: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 40,
  })
  product: string

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: false,
  })
  skus: number

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: false,
  })
  cartons: number

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  pallets: number

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: false,
  })
  weight: number

  @ConditionField({
    open: false,
    options: {
      operators: [
        {
          name: OPERATORS.EQUAL.name,
          value: OPERATORS.EQUAL.value,
        },
      ],
      values: ['Yes', 'No'],
    },
  })
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  forklift_driver: boolean

  @ConditionField({
    open: false,
    options: {
      operators: [
        {
          name: OPERATORS.EQUAL.name,
          value: OPERATORS.EQUAL.value,
        },
      ],
      values: ['Yes', 'No'],
    },
  })
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  trash: boolean

  @ConditionField({
    open: false,
    options: {
      operators: [
        {
          name: OPERATORS.EQUAL.name,
          value: OPERATORS.EQUAL.value,
        },
      ],
      values: ['Yes', 'No'],
    },
  })
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  mixed: boolean

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  start: String

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  finish: Date

  @Column({
    type: 'varchar',
    nullable: false,
    length: 40,
  })
  total_time: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 40,
  })
  plt_time_min: string

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  @IsBoolean()
  active: boolean

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_DATE',
  })
  updated_at: Date

  @Column({
    type: 'date',
    nullable: true,
  })
  deleted_at: Date
}
