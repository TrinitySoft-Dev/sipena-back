import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Put,
  Param,
} from '@nestjs/common'
import { RulesService } from './rules.service'
import { CreateRuleDto } from './dto/create-rule.dto'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'
import { UpdateRuleDto } from './dto/update-rule.dto'

@ApiTags('Rules')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @ApiOperation({
    summary: 'Create a rule',
    description: 'This method creates a rule',
  })
  @Post()
  async create(@Body() createRuleDto: CreateRuleDto) {
    return await this.rulesService.create(createRuleDto)
  }

  @ApiOperation({
    summary: 'Returns the fields that can be conditioned',
    description: 'This method returns the fields that can be conditioned',
  })
  @Get()
  async allowedFields() {
    return await this.rulesService.allowedFields()
  }

  @ApiOperation({
    summary: 'Find by page',
    description: 'This method returns a list of rules by page',
  })
  @Get('find')
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return await this.rulesService.find({ page, pageSize })
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
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.rulesService.findById(id)
  }

  @ApiOperation({
    summary: 'Update a rule',
    description: 'This method updates a rule',
  })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRuleDto: UpdateRuleDto) {
    return await this.rulesService.update(id, updateRuleDto)
  }
}
