import 'reflect-metadata'

export function ConditionField(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fields = Reflect.getMetadata('conditionFields', target) || []
    fields.push(propertyKey)
    Reflect.defineMetadata('conditionFields', fields, target)
  }
}
