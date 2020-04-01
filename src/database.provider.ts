import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import DBConfiguration from './config/database.config';

export const databaseProviders = [
  TypeOrmModule.forRoot({
    type: 'mongodb',
    host: (() => {
      console.log(DBConfiguration());
      return DBConfiguration().DATABASE_HOST
    })(),
    port: DBConfiguration().DATABASE_PORT,
    database: 'GameLibrary',
    username: DBConfiguration().DATABASE_USERNAME,
    password: DBConfiguration().DATABASE_PASSWORD,
    entities: [
      join(__dirname, '**', '*.entity.{ts,js}')
    ],
    synchronize: true,
    useUnifiedTopology: true
  })
];