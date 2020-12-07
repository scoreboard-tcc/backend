const Knex = require('knex');

const { SchemaBuilder } = Knex;

const tableName = 'Player';

/**
 * Up
 *
 * @param {Knex} knex - knex
 * @returns {SchemaBuilder} - knex
 */
exports.up = (knex) => knex.schema
  .createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();

    table
      .string('email')
      .unique()
      .notNullable();

    table
      .string('name')
      .notNullable();

    table
      .timestamp('createdAt')
      .defaultTo(knex.fn.now());
  });

/**
 * Down
 *
 * @param {Knex} knex - knex
 * @returns {Knex} - knex
 */
exports.down = (knex) => knex.schema.dropTable(tableName);
