require('dotenv').config(); // Load environment variables from .env

console.log('Database Name:', process.env.DB_NAME); // Check if DB_NAME is correctly loaded

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations', // Path to migrations directory
    },
    seeds: {
      directory: './seeds', // Path to seeds directory
    },
  },
  // Other environments...
};
