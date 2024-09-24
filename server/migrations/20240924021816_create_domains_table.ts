import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  console.log("Running domains table migration...");
  // Create the domains table
  await knex.schema.createTable("domains", (table) => {
    table.uuid("uuid").primary(); // UUID as primary key
    table.string("name").notNullable().unique(); // Domain name, unique
    table.uuid("upper_domain_id").nullable(); // Optional UUID reference
    table.uuid("middle_domain_id").nullable(); // Optional UUID reference
    table.integer("order").defaultTo(0).notNullable(); // Order column with a default value of 0
    table.text("level").notNullable(); // Domain level as text

    table.timestamp("created_at").defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Update timestamp
  });

  // Add check constraint on the "level" column to ensure valid values
  await knex.raw(`
    ALTER TABLE domains
    ADD CONSTRAINT domains_level_check
    CHECK (level IN ('upper', 'middle', 'lower'));
  `);

  console.log("domains table created successfully");
}

export async function down(knex: Knex): Promise<void> {
  // Drop the check constraint
  await knex.raw(`
    ALTER TABLE domains
    DROP CONSTRAINT IF EXISTS domains_level_check;
  `);

  // Drop the domains table
  await knex.schema.dropTable("domains");
}
