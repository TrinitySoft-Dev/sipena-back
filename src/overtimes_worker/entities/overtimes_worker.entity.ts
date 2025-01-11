import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({
  name: 'overtimes_workers',
})
export class OvertimesWorker {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string

  @Column({
    type: 'float',
    nullable: false,
  })
  rate: number

  @Column({
    type: 'int',
    nullable: false,
  })
  hours: number

  @Column({
    type: 'int',
    nullable: false,
  })
  overtime_number: number

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
