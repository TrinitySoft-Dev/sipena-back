import { User } from '@/users/entities/user.entity'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  name: string

  @Column({
    nullable: false,
    type: 'decimal',
  })
  price: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  item_code: string

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
  })
  active: boolean

  @ManyToMany(() => User, user => user.products)
  customers: User[]

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
