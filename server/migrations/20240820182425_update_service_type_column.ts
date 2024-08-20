import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table('services', (table) => {
    // Remove the old column if it exists
    table.dropColumn('tier');

    // Add the new column with the new name
    table.enu('type', ['upper', 'middle', 'lower']).notNullable().defaultTo('lower');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table('services', (table) => {
    // Revert the change: drop the new column and re-add the old one
    table.dropColumn('type');
    table.enu('tier', ['upper', 'middle', 'lower']).notNullable().defaultTo('lower');
  });
};
