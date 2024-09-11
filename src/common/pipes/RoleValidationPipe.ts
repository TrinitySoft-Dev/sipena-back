import { CreateUserDto } from '@/users/dto/worker-user.dto'
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

export class RoleValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    let dtoClass = null

    switch (value.role) {
      case 'WORKER':
        dtoClass = CreateUserDto
        break
      default:
        throw new BadRequestException('Invalid role')
    }

    const obj = plainToInstance(dtoClass, value)
    const errors = await validate(obj)

    if (errors.length > 0) {
      const allerrors = errors.reduce((acc, error) => {
        const constraint = Object.values(error.constraints)
        return acc.concat(constraint)
      }, [])

      throw new BadRequestException(allerrors)
    }

    return obj
  }
}
