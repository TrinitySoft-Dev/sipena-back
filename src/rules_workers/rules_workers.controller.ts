import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RulesWorkersService } from './rules_workers.service';
import { CreateRulesWorkerDto } from './dto/create-rules_worker.dto';
import { UpdateRulesWorkerDto } from './dto/update-rules_worker.dto';

@Controller('rules-workers')
export class RulesWorkersController {
  constructor(private readonly rulesWorkersService: RulesWorkersService) {}

  @Post()
  create(@Body() createRulesWorkerDto: CreateRulesWorkerDto) {
    return this.rulesWorkersService.create(createRulesWorkerDto);
  }

  @Get()
  findAll() {
    return this.rulesWorkersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rulesWorkersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRulesWorkerDto: UpdateRulesWorkerDto) {
    return this.rulesWorkersService.update(+id, updateRulesWorkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rulesWorkersService.remove(+id);
  }
}
