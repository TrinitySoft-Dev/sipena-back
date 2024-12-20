import { OPERATORS } from '@/common/conts/operators'
import { ConditionField } from '@/common/decorators/condition-field.decorator'
import { SelectedField } from '@/common/decorators/selected-fields.decorator'
import { ContainerSize } from '@/container_size/entities/container_size.entity'
import { Product } from '@/products/entities/product.entity'
import { Work } from '@/work/entities/work.entity'
import { IsBoolean } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'containers',
})
export class Container {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: true,
    length: 40,
    comment: 'Container number',
  })
  @SelectedField()
  container_number: string

  @ManyToOne(() => Work, work => work.container)
  @SelectedField({
    relation: () => Work,
  })
  work: Work

  @SelectedField()
  @ManyToOne(() => ContainerSize, container_size => container_size.container)
  size: ContainerSize

  @ManyToOne(() => Product, product => product.containers, { cascade: true })
  product: Product

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: true,
  })
  @SelectedField()
  skus: number

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: true,
  })
  @SelectedField()
  cartons: number

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  @SelectedField()
  pallets: number

  @ConditionField({ open: true })
  @Column({
    type: 'integer',
    nullable: true,
  })
  @SelectedField()
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
    default: true,
  })
  @SelectedField()
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
    nullable: true,
    default: false,
  })
  @SelectedField()
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
    nullable: true,
    default: false,
  })
  @SelectedField()
  mixed: boolean

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  @SelectedField()
  start: String

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  @SelectedField()
  finish: Date

  @Column({
    type: 'varchar',
    nullable: true,
    length: 40,
  })
  @SelectedField()
  total_time: string

  @Column({
    type: 'varchar',
    nullable: true,
    length: 40,
  })
  @SelectedField()
  plt_time_min: string

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  @IsBoolean()
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
