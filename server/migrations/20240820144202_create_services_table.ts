import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Running services table migration...');
  // Create the services table
  await knex.schema.createTable('services', (table) => {
    table.uuid('uuid').primary(); // UUID as primary key
    table.string('name').notNullable().unique(); // Service name, unique
    table.uuid('upper_service_id').nullable(); // Optional UUID reference
    table.uuid('middle_service_id').nullable(); // Optional UUID reference
    table.integer('order').defaultTo(0).notNullable(); // Order column with a default value of 0
    table.text('level').notNullable(); // Service level as text

    table.timestamp('created_at').defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Update timestamp
  });

  // Add check constraint on the "level" column to ensure valid values
  await knex.raw(`
    ALTER TABLE services
    ADD CONSTRAINT services_level_check
    CHECK (level IN ('upper', 'middle', 'lower'));
  `);

  console.log('Services table created successfully');
}

export async function down(knex: Knex): Promise<void> {
  // Drop the check constraint
  await knex.raw(`
    ALTER TABLE services
    DROP CONSTRAINT IF EXISTS services_level_check;
  `);

  // Drop the services table
  await knex.schema.dropTable('services');
}
 