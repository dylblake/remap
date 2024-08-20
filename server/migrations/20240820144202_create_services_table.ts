import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('services', (table) => {
    table.uuid('uuid').primary(); // UUID as primary key
    table.string('name').notNullable(); // Service name
    table.enu('tier', ['pending', 'approved', 'rejected']).notNullable(); // Enum for service tier
    table.uuid('upper_service_id').nullable(); // Optional UUID reference
    table.uuid('middle_service_id').nullable(); // Optional UUID reference
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Update timestamp
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('services');
}
