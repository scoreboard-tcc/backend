const Knex = require('knex');

const { SchemaBuilder } = Knex;

const tableName = 'Enrollment';

/**
 * Up
 *
 * @param {Knex} knex - knex
 * @returns {SchemaBuilder} - knex
 */
exports.up = (knex) => knex.schema
  .createTable(tableName, (table) => {
    table
      .integer('academyId')
      .notNullable()
      .references('id')
      .inTable('Academy');

    table
      .integer('playerId')
      .notNullable()
      .references('id')
      .inTable('Player');

    table
      .timestamp('createdAt')
      .defaultTo(knex.fn.now());

    table.primary(['academyId', 'playerId']);
  });

/**
 * Down
 *
 * @param {Knex} knex - knex
 * @returns {Knex} - knex
 */
exports.down = (knex) => knex.schema.dropTable(tableName);
