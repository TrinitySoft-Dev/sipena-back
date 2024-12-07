import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator'
import getSelectedFieldsPaths from '../helpers/getSelectFieldsPaths'
import { Timesheet } from '@/timesheet/entities/timesheet.entity'

const TEMPLATE_PATHS = getSelectedFieldsPaths(Timesheet)

export class Valuecell implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    const fields = [...value.matchAll(/@path:([\w.]+)/g)].map(match => match[1])
    return fields.every(field => TEMPLATE_PATHS.includes(field))
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Invalid path: ${validationArguments?.value}`
  }
}
