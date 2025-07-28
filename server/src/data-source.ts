import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from './todo/entities/todo.entity';
import * as dotenv from 'dotenv';

// Load variables from .env file
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [Todo],
  migrations: ['./src/migration/*.ts'],
  subscribers: [],
});
