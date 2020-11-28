const Knex = require('knex');

const { SchemaBuilder } = Knex;

const tableName = 'Coordinator';

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
      .notNullable();

    table
      .string('password')
      .notNullable()
      .defaultTo('');

    table
      .string('name')
      .notNullable();

    table
      .integer('academyId')
      .notNullable()
      .references('id')
      .inTable('Academy');

    table
      .boolean('isVerified')
      .notNullable()
      .defaultTo(false);

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
