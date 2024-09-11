import { exampleWorkerSchema, workerSchema } from './worker.schema'

export const userSchema = {
  oneOf: [workerSchema],
}

export const exampleUserSchema = {
  worker: {
    summary: 'Worker',
    value: exampleWorkerSchema,
  },
}
