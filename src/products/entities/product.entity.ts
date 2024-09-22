import { User } from '@/users/entities/user.entity'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  name: string

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 60,
  })
  item_code: string

  @ManyToMany(() => User, user => user.products)
  customers: User[]

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
