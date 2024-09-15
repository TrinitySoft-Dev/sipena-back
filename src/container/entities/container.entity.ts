import { IsBoolean } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column({
    type: 'varchar',
    nullable: false,
    length: 40,
  })
  work: string

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

  @Column({
    type: 'integer',
    nullable: false,
  })
  skus: number

  @Column({
    type: 'integer',
    nullable: false,
  })
  cartons: number

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  pallets: number

  @Column({
    type: 'integer',
    nullable: false,
  })
  weight: number

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  forklift_driver: boolean

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  trash: boolean

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  mixed: boolean

  @Column({
    type: 'date',
    nullable: false,
  })
  start: Date

  @Column({
    type: 'date',
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
    nullable: false,
  })
  deleted_at: Date
}
