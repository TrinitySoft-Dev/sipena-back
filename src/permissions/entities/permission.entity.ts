import { GroupPermission } from '@/group_permissions/entities/group_permission.entity'
import { Role } from '@/roles/entities/role.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
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
    length: 80,
  })
  name: string

  @Column({
    type: 'varchar',
    length: 80,
  })
  label: string

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[]

  @ManyToOne(() => GroupPermission, group_permission => group_permission.permissions)
  group_permissions: GroupPermission

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
