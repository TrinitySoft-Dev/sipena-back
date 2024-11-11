import { Role } from '@/roles/entities/role.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
    type: 'varchar',
    length: 120,
  })
  name: string

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[]

  @CreateDateColumn({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'date',
    default: () => 'CURRENT_DATE',
    onUpdate: 'CURRENT_DATE',
  })
  update_at: Date

  @DeleteDateColumn({
    type: 'date',
  })
  delete_at: Date
}
