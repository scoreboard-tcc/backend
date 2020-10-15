const Knex = require('knex');

const { SchemaBuilder } = Knex;

const tableName = 'Academy';

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
      .string('subdomain')
      .unique()
      .notNullable();

    table
      .string('name')
      .notNullable();

    table
      .string('address');

    table
      .text('additionalInfo')
      .defaultTo('');

    table
      .string('logoUrl');

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
