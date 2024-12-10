import { Permission } from '@/permissions/entities/permission.entity'
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
  name: 'group_permissions',
})
export class GroupPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
    type: 'varchar',
    length: 80,
  })
  name: string

  @OneToMany(() => Permission, permission => permission.group_permissions, { cascade: true })
  permissions: Permission[]

  @CreateDateColumn({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  update_at: Date

  @DeleteDateColumn({
    type: 'date',
  })
  delete_at: Date
}
