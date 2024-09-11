import { clientSchema, exampleClientSchema } from './client.schema'
import { exampleWorkerSchema, workerSchema } from './worker.schema'

export const userSchema = {
  oneOf: [workerSchema, clientSchema],
}

export const exampleUserSchema = {
  worker: {
    summary: 'Worker',
    value: exampleWorkerSchema,
  },
  client: {
    summary: 'Client',
    value: exampleClientSchema,
  },
}
