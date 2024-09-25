import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Product')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  find(@Req() req: any) {
    return this.productsService.find(req?.payload)
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.productsService.findById(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.productsService.deleteById(id)
    return { message: `Product with id ${id} has been deleted` }
  }
}
