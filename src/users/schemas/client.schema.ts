import { baseSchema, exampleBaseSchema } from './base.schema'

export const clientSchema = {
  type: 'object',
  properties: {
    ...baseSchema,
    phone: { type: 'string' },
  },
}

export const exampleClientSchema = {
  ...exampleBaseSchema,
  phone: '123456789',
}
