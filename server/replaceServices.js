const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const csvFilePath = '/Users/dylanevans/GloDex/server/services.csv 23-18-45-530.csv'; // Ensure this path is correct

async function replaceDataInTable() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Truncate the table to remove existing data
    await client.query('TRUNCATE TABLE services RESTART IDENTITY');

    // Stream CSV file and insert data
    const insertPromises = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        let { uuid, name, type, upper_service_id, middle_service_id, order } = row;

        // Clean and process the IDs
        const cleanUUID = (value) => {
          const trimmed = value.trim();
          if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed === "null'") {
            return null;
          }
          return trimmed;
        };

        const upperServiceIdProcessed = cleanUUID(upper_service_id);
        const middleServiceIdProcessed = cleanUUID(middle_service_id);

        console.log('Processed values:', { uuid, upperServiceIdProcessed, middleServiceIdProcessed });

        const insertPromise = client.query(
          `INSERT INTO services (uuid, name, type, upper_service_id, middle_service_id, "order") 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            uuid,
            name,
            type,
            upperServiceIdProcessed,
            middleServiceIdProcessed,
            order
          ]
        );
        insertPromises.push(insertPromise);
      })
      .on('end', async () => {
        try {
          await Promise.all(insertPromises); // Wait for all inserts to finish
          await client.query('COMMIT');
          console.log('Data successfully replaced');
        } catch (err) {
          await client.query('ROLLBACK');
          console.error('Error during data replacement:', err);
        } finally {
          client.release();
        }
      });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error connecting to the database:', err);
    client.release();
  }
}

replaceDataInTable();
