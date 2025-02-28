import { Injectable } from '@nestjs/common'
import { CreateInfoworkerDto } from './dto/create-infoworker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Infoworker } from './entities/infoworker.entity'
import { Repository } from 'typeorm'
import { UpdateInfoworkerDto } from './dto/update-infoworker.dto'

@Injectable()
export class InfoworkersService {
  constructor(@InjectRepository(Infoworker) private readonly infoworkerRepository: Repository<Infoworker>) {}

  create(createInfoworkerDto: CreateInfoworkerDto): Promise<Infoworker> {
    return this.infoworkerRepository.save(createInfoworkerDto)
  }

  update(id: number, updateInfoworkerDto: UpdateInfoworkerDto) {
    return this.infoworkerRepository.update(id, updateInfoworkerDto)
  }

  validateInfoworker(infoworker: Infoworker | null) {
    if (!infoworker) return false

    const keys = Object.keys(infoworker)
    if (keys.length === 0) return false
    let complete = true

    keys.forEach(key => {
      if (infoworker[key] === undefined) complete = false
    })

    return complete
  }
}
