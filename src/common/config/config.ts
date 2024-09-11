import 'dotenv/config';
import * as joi from 'joi';

interface ENVIROMENTS {
  DB: {
    HOST: string;
    PORT: string;
    PASSWORD: string;
    USERNAME: string;
    DATABASE: string;
  };
  PORT: string;
}
const envs = joi

  .object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    PORT: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value } = envs.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
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
};
