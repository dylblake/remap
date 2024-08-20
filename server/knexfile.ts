require('dotenv').config(); // Load environment variables from .env

module.exports = {
  development: {
    client: 'pg', // PostgreSQL client
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'your_database_user',
      password: process.env.DB_PASSWORD || 'your_database_password',
      database: process.env.DB_NAME || 'your_database_name',
    },
    migrations: {
      directory: './migrations', // Directory to store migration files
    },
    seeds: {
      directory: './seeds', // Directory to store seed files
    },
  }
}