import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { ILike, In, Repository } from 'typeorm'
import { UpdateProductDto } from './dto/update-product.dto'
import { UsersProductsProducts } from './entities/users-products-products.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(UsersProductsProducts)
    private readonly usersProductsRepository: Repository<UsersProductsProducts>,
  ) {}
  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto)
  }

  // Método para obtener productos relacionados con un cliente
  async findProductsByCustomer(userId: number) {
    // Obtener los productIds de la tabla intermedia relacionados con el userId
    const userProducts = await this.usersProductsRepository.find({
      where: { usersId: userId },
    })

    // Extraer los productIds
    const productIds = userProducts.map(up => up.productsId)

    // Obtener los productos relacionados con esos productIds
    const products = await this.productRepository.find({
      where: { id: In(productIds) }, // Usamos In para buscar múltiples IDs
    })

    return products // Devolver los productos asociados al cliente
  }

  async find({ productName, page, pageSize }: { productName: string; page: number; pageSize: number }) {
    const whereCondition = productName ? { name: ILike(`${productName}%`) } : {}

    const [result, total] = await this.productRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return { result, pagination: { page, pageSize, total } }
  }

  async selectProducts() {
    const result = await this.productRepository.find({
      select: ['id', 'name'],
    })

    return result
  }

  // async findProductsByCustomer(userId: number) {
  //   // Consulta los productsId relacionados con el userId en la tabla intermedia
  //   const userProducts = await this.userRepository.find({
  //     where: { usersId: userId },
  //   })

  //   // Extrae los productsId
  //   const productIds = userProducts.map(up => up.productsId)

  //   // Obtiene los productos relacionados con esos productIds
  //   const products = await this.productRepository.findByIds(productIds)

  //   return products // Devuelve los productos asociados al cliente
  // }

  async findById(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const { customers, ...rest } = updateProductDto

      if (Object.keys(rest).length > 0) {
        await this.productRepository.update(id, rest)
      }

      if (customers) {
        await this.productRepository.createQueryBuilder('product').relation(Product, 'customers').of(id).add(customers)
      }
      return { message: 'Producto actualizado exitosamente' }
    } catch (error) {
      throw error
    }
  }

  async deleteById(id: number): Promise<void> {
    const result = await this.productRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }
  }
}
