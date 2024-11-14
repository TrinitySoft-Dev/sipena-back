import { Infoworker } from '@/infoworkers/entities/infoworker.entity'
import { State } from '@/state/entities/state.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'cities',
})
export class City {
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

  @ManyToOne(() => State, state => state.cities)
  state: State

  @OneToMany(() => Infoworker, infoworker => infoworker.city)
  infoworkers: Infoworker[]

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
