import fs from "fs";
import csv from "csv-parser";
import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex): Promise<void> {
  const domains: any[] = [];

  // Read the CSV file
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream("/usr/src/app/data/domains.csv")
      .pipe(csv())
      .on("data", (row) => {
        // Convert empty strings to null
        const formattedRow = {
          uuid: row.uuid || uuidv4(),
          name: row.name,
          upper_domain_id: row.upper_domain_id || null,
          middle_domain_id: row.middle_domain_id || null,
          created_at: row.created_at || knex.fn.now(),
          updated_at: row.updated_at || knex.fn.now(),
          level: row.level,
          order: row.order,
        };
        domains.push(formattedRow);
      })
      .on("end", async () => {
        try {
          // Insert the data into the database
          await knex("domains").insert(domains);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => reject(error));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex("domains").del(); // Clear the table if rollback is needed
}
