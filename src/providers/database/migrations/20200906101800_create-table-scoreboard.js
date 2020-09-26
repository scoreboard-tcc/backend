const Knex = require('knex');

const { SchemaBuilder } = Knex;

const tableName = 'Scoreboard';

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
      .string('serialNumber')
      .notNullable();

    table
      .integer('academyId')
      .notNullable()
      .references('id')
      .inTable('Academy');

    table
      .string('description')
      .notNullable();

    table
      .string('publishToken');

    table
      .string('refreshToken');

    table
      .string('staticToken')
      .notNullable();

    table
      .boolean('active')
      .defaultTo(true);

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
