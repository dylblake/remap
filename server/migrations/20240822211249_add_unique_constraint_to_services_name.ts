import { Knex } from 'knex';

exports.up = async function (knex: Knex): Promise<void> {
  // Add a unique constraint to the 'name' column
  await knex.schema.alterTable('services', (table) => {
    table.unique(['name']); // Pass column names as an array
  });
};

exports.down = async function (knex: Knex): Promise<void> {
  // Remove the unique constraint from the 'name' column
  await knex.schema.table('services', (table) => {
    table.dropUnique(['name']); // Pass column names as an array
  });
};
