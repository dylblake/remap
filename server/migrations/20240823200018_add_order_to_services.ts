import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('services', function(table: Knex.TableBuilder) {
    table.integer('order').defaultTo(0); // Adds the 'order' column with a default value of 0
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('services', function(table: Knex.TableBuilder) {
    table.dropColumn('order'); // Removes the 'order' column if the migration is rolled back
  });
}