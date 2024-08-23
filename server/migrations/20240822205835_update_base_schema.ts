import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Drop the existing check constraint if it exists
  await knex.raw(`
    ALTER TABLE services
    DROP CONSTRAINT IF EXISTS services_type_check;
  `);

  // Alter the column type to text
  await knex.schema.alterTable('services', (table) => {
    table.text('created_at').alter(); // Change to text type if needed
    table.text('updated_at').alter(); // Change to text type if needed
  });

  // Add or modify check constraints if necessary
  await knex.raw(`
    ALTER TABLE services
    ADD CONSTRAINT services_type_check
    CHECK (type IN ('upper', 'middle', 'lower'));
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Remove the check constraint if it exists
  await knex.raw(`
    ALTER TABLE services
    DROP CONSTRAINT IF EXISTS services_type_check;
  `);

  // Revert the column type to the original
  await knex.schema.alterTable('services', (table) => {
    table.enu('type', ['upper', 'middle', 'lower']).alter(); // Change back to enum
  });
}
