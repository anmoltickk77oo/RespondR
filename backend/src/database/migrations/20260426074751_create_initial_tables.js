/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').defaultTo('user');
      table.timestamps(true, true);
    });
  }

  const hasIncidents = await knex.schema.hasTable('incidents');
  if (!hasIncidents) {
    await knex.schema.createTable('incidents', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('location').notNullable();
      table.string('incident_type').notNullable();
      table.enum('status', ['pending', 'responding', 'resolved', 'acknowledged']).defaultTo('pending');
      table.timestamps(true, true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('incidents')
    .dropTableIfExists('users');
};
