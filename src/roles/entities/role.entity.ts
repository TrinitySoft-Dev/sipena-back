import { Permission } from '@/permissions/entities/permission.entity'
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
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

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
  })
  active: boolean

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  created_at: Date

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  updated_at: Date
}
