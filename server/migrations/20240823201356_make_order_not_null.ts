import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Ensure all existing rows have a default value for the 'order' column
  await knex('services').update({ order: knex.raw('COALESCE("order", 0)') });

  return knex.schema.alterTable('services', function (table: Knex.TableBuilder) {
    table.integer('order').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('services', function (table: Knex.TableBuilder) {
    table.integer('order').nullable().alter();
  });
}