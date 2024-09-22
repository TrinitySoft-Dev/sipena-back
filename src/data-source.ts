import { DataSource } from 'typeorm'
import { config } from './common/config/config'

export default new DataSource({
  type: 'postgres',
  host: config.DB.HOST,
  port: Number(config.DB.PORT),
  username: config.DB.USERNAME,
  password: config.DB.PASSWORD,
  database: config.DB.DATABASE,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
  synchronize: false,
  ssl: true,
})
