import { Permission } from '@/permissions/entities/permission.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
    type: 'varchar',
    nullable: false,
  })
  name: string

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  description: string

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[]

  @OneToMany(() => User, user => user.role)
  users: User[]

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
  })
  status: boolean

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
