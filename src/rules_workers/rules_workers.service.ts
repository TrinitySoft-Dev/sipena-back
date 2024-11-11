import { Injectable } from '@nestjs/common';
import { CreateRulesWorkerDto } from './dto/create-rules_worker.dto';
import { UpdateRulesWorkerDto } from './dto/update-rules_worker.dto';

@Injectable()
export class RulesWorkersService {
  create(createRulesWorkerDto: CreateRulesWorkerDto) {
    return 'This action adds a new rulesWorker';
  }

  findAll() {
    return `This action returns all rulesWorkers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rulesWorker`;
  }

  update(id: number, updateRulesWorkerDto: UpdateRulesWorkerDto) {
    return `This action updates a #${id} rulesWorker`;
  }

  remove(id: number) {
    return `This action removes a #${id} rulesWorker`;
  }
}
