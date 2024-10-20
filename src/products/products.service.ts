import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { ILike, In, Repository } from 'typeorm'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto)
  }

  async findProductsByCustomer(userId: number): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.customers', 'customer')
      .where('customer.id = :userId', { userId })
      .getMany()

    return products
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
