import 'reflect-metadata'
import { OPERATORS } from '../conts/operators'

export function ConditionField(options?: { open: boolean; options?: any }): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fields = Reflect.getMetadata('conditionFields', target) || []

    if (options?.open) {
      const values = Object.values(OPERATORS)
      fields.push({
        field: propertyKey,
        open: options?.open ?? true,
        options: values,
      })
    }

    if (!options?.open) {
      const { operators, values } = options?.options as any
      fields.push({
        field: propertyKey,
        open: options?.open ?? true,
        options: operators,
        values,
      })
    }

    Reflect.defineMetadata('conditionFields', fields, target)
  }
}
