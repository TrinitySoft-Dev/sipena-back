import { Template } from '@/template/entities/template.entity'
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
  name: 'template_columns',
})
export class TemplateColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  value_cell: string

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  value_cell_html: string

  @Column({
    type: 'int',
    nullable: true, //temporalmente
  })
  order: number

  @Column({
    type: 'varchar',
    nullable: true,
  })
  templateId: string

  @ManyToOne(() => Template, template => template.columns, { onDelete: 'CASCADE' })
  template: Template

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
