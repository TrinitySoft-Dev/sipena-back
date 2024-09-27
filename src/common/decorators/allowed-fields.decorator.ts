import { Container } from '@/container/entities/container.entity'
import 'reflect-metadata'

export function getAllowedConditionFields() {
  const container = new Container()
  const fields = Reflect.getMetadata('conditionFields', container)
  return fields.map(field => field.field)
}
