import fs from 'fs';
import csv from 'csv-parser';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const services: any[] = [];

  // Read the CSV file
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream('/usr/src/app/data/services.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Convert empty strings to null
        const formattedRow = {
          uuid: row.uuid,
          name: row.name,
          upper_service_id: row.upper_service_id || null,
          middle_service_id: row.middle_service_id || null,
          created_at: row.created_at || knex.fn.now(),
          updated_at: row.updated_at || knex.fn.now(),
          level: row.level,
          order: row.order,
        };
        services.push(formattedRow);
      })
      .on('end', async () => {
        try {
          // Insert the data into the database
          await knex('services').insert(services);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => reject(error));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('services').del(); // Clear the table if rollback is needed
}
