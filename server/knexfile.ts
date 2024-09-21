import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

console.log('Database Name:', process.env.DB_NAME); // Check if DB_NAME is correctly loaded
console.log(JSON.stringify(process.env, null, 2)); // Print all environment variables

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
    seeds: {
      directory: './seeds', // Path to seeds directory
    },
  },
  // production: {
  //   client: "pg",
  //   connection: {
  //     host: process.env.DB_HOST,
  //     port: Number(process.env.DB_PORT),
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 20,
  //   },
  //   migrations: {
  //     directory: "./migrations",
  //     extension: "ts",
  //   },
  //   seeds: {
  //     directory: './seeds', // Path to seeds directory
  //   },
  // },
};

export default knexConfig;