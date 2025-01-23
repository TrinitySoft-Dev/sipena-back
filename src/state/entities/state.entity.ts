import { City } from '@/city/entities/city.entity'
import { Infoworker } from '@/infoworkers/entities/infoworker.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({})
export class State {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
    unique: true,
  })
  name: string

  @OneToMany(() => City, city => city.state)
  cities: City[]

  @OneToMany(() => User, user => user.state)
  users: User[]

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deleteAt: Date
}
