import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { RulesWorkersService } from './rules_workers.service'
import { CreateRulesWorkerDto } from './dto/create-rules_worker.dto'
import { UpdateRulesWorkerDto } from './dto/update-rules_worker.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Rules Workers')
@Controller('rules-workers')
export class RulesWorkersController {
  constructor(private readonly rulesWorkersService: RulesWorkersService) {}

  @Post()
  create(@Body() createRulesWorkerDto: CreateRulesWorkerDto) {
    return this.rulesWorkersService.create(createRulesWorkerDto)
  }
}
