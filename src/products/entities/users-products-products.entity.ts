import { Entity, PrimaryColumn } from 'typeorm'

@Entity('users_products_products') // Nombre de la tabla en la base de datos
export class UsersProductsProducts {
  @PrimaryColumn()
  usersId: number // ID del usuario

  @PrimaryColumn()
  productsId: number // ID del producto
}
