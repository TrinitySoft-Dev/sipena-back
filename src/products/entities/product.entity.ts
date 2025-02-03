import { SelectedField } from '@/common/decorators/selected-fields.decorator'
import { Container } from '@/container/entities/container.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @SelectedField()
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
    nullable: false,
    type: 'decimal',
  })
  pay_worker: number

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  item_code: string

  @Column({
    nullable: false,
    type: 'boolean',
    default: true,
  })
  active: boolean

  @OneToMany(() => Container, container => container.product)
  containers: Container[]

  @ManyToMany(() => User, user => user.products)
  customers: User[]

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
