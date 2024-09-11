import { baseSchema, exampleBaseSchema } from './base.schema'

export const workerSchema = {
  type: 'object',
  properties: {
    ...baseSchema,
    phone: { type: 'string' },
    tfn: { type: 'string' },
    abn: { type: 'string' },
    birthday: { type: 'string' },
    employment_end_date: { type: 'string' },
    passport: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    visa: { type: 'string' },
  },
}

export const exampleWorkerSchema = {
  ...exampleBaseSchema,
  phone: '123456789',
  tfn: '123456789',
  abn: '123456789',
  birthday: '2000-01-01',
  employment_end_date: '2000-01-01',
  passport: '123456789',
  address: '123456789',
  city: '123456789',
  visa: '123456789',
}
