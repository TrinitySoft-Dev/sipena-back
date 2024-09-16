import { Container } from '@/container/entities/container.entity'
import 'reflect-metadata'

export function getAllowedConditionFields(): string[] {
  const container = new Container()
  const fields = Reflect.getMetadata('conditionFields', container)
  return fields || []
}
