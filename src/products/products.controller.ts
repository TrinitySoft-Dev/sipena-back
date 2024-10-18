import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'
import { UpdateProductDto } from './dto/update-product.dto'

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
  @ApiQuery({
    name: 'productName',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  async find(
    @Query('productName') productName?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return await this.productsService.find({ productName, page, pageSize })
  }

  @ApiOperation({
    summary: 'Find by id',
    description: 'This method returns a rule by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.productsService.findById(id)
  }

  @ApiOperation({
    summary: 'Update a product',
    description: 'This method updates a product',
  })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, updateProductDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.productsService.deleteById(id)
    return { message: `Product with id ${id} has been deleted` }
  }
}
