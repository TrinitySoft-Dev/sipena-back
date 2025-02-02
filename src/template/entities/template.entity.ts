import { TemplateColumn } from '@/template_columns/entities/template_column.entity'
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
  name: 'templates',
})
export class Template {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string

  @OneToMany(() => TemplateColumn, templateColumn => templateColumn.template, { cascade: true })
  columns: TemplateColumn[]

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    enum: ['CUSTOMER', 'WORKER'],
  })
  type: string

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at: Date
}
