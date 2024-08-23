import { Knex } from 'knex';

exports.up = async function (knex: Knex): Promise<void> {
  // Drop the existing check constraint if it exists
  await knex.raw(`
    ALTER TABLE services
    DROP CONSTRAINT IF EXISTS services_type_check;
  `);

  // Alter the column type to text
  await knex.schema.alterTable('services', (table) => {
    table.text('type').alter(); // Change to text type
  });

  // Add a new check constraint
  await knex.raw(`
    ALTER TABLE services
    ADD CONSTRAINT services_type_check
    CHECK (type IN ('upper', 'middle', 'lower'));
  `);
};

exports.down = async function (knex: Knex): Promise<void> {
  // Remove the check constraint if it exists
  await knex.raw(`
    ALTER TABLE services
    DROP CONSTRAINT IF EXISTS services_type_check;
  `);

  // Revert the column type to the original
  await knex.schema.alterTable('services', (table) => {
    table.enu('type', ['upper', 'middle', 'lower']).alter(); // Change back to enum
  });
};
