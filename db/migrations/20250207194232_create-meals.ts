import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary();
    table.text("userId").notNullable();
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.timestamp("consumed_at").defaultTo(knex.fn.now()).notNullable();
    table.boolean("onDiet").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
