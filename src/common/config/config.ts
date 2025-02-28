import { BadRequestException } from '@nestjs/common'
import 'dotenv/config'
import * as joi from 'joi'

interface ENVIROMENTS {
  DB: {
    HOST: string
    PORT: string
    PASSWORD: string
    USERNAME: string
    DATABASE: string
  }
  AWS: {
    S3_BUCKET: string
    S3_ACCESS_KEY: string
    S3_SECRET_ACCESS_KEY: string
    S3_BUCKET_NAME: string
  }
  PORT: string
  JWT_SECRET: string
  JWT_EXPIRES: string
  JWT_REFRESH_EXPIRES: string
  JWT_REFRESH_SECRET: string
  SIPENA_FILES: string
  SWAGGER_USER: string
  SWAGGER_PASSWORD: string
  RESEND_API_KEY: string
  SIPENA_URI_FRONT: string
}
const envs = joi
  .object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    PORT: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES: joi.string().required(),
    S3_BUCKET: joi.string().required(),
    S3_ACCESS_KEY: joi.string().required(),
    S3_SECRET_ACCESS_KEY: joi.string().required(),
    S3_BUCKET_NAME: joi.string().required(),
    SIPENA_FILES: joi.string().required(),
    SWAGGER_USER: joi.string().required(),
    SWAGGER_PASSWORD: joi.string().required(),
    RESEND_API_KEY: joi.string().required(),
    SIPENA_URI_FRONT: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_REFRESH_EXPIRES: joi.string().required(),
  })
  .unknown()
  .required()

const { error, value } = envs.validate(process.env)

if (error) {
  throw new BadRequestException(`Config validation error: ${error.message}`)
}

export const config: ENVIROMENTS = {
  DB: {
    HOST: value.DB_HOST,
    PORT: value.DB_PORT,
    PASSWORD: value.DB_PASSWORD,
    USERNAME: value.DB_USERNAME,
    DATABASE: value.DB_DATABASE,
  },
  PORT: value.PORT,
  JWT_SECRET: value.JWT_SECRET,
  JWT_EXPIRES: value.JWT_EXPIRES,
  JWT_REFRESH_EXPIRES: value.JWT_REFRESH_EXPIRES,
  JWT_REFRESH_SECRET: value.JWT_REFRESH_SECRET,
  SIPENA_FILES: value.SIPENA_FILES,
  AWS: {
    S3_BUCKET: value.S3_BUCKET,
    S3_ACCESS_KEY: value.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: value.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: value.S3_BUCKET_NAME,
  },
  SWAGGER_USER: value.SWAGGER_USER,
  SWAGGER_PASSWORD: value.SWAGGER_PASSWORD,
  RESEND_API_KEY: value.RESEND_API_KEY,
  SIPENA_URI_FRONT: value.SIPENA_URI_FRONT,
}
