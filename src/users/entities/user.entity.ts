import { Infoworker } from '@/infoworkers/entities/infoworker.entity'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    nullable: false,
    type: 'varchar',
    comment: 'User email',
  })
  email: string

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'User password',
  })
  password: string

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'User name',
  })
  name: string

  @Column({
    nullable: false,
    type: 'varchar',
    comment: 'User lastname',
  })
  last_name: string

  @OneToOne(() => Infoworker, infoworker => infoworker.id)
  @JoinColumn()
  infoworker: Infoworker

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
    comment: 'User avatar',
  })
  active: boolean

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  updated_at: Date

  @Column({
    type: 'date',
    nullable: true,
  })
  deleted_at: Date
}
