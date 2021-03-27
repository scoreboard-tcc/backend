const Knex = require('knex');

const { SchemaBuilder } = Knex;

const tableName = 'Match';

/**
 * Up
 *
 * @param {Knex} knex - knex
 * @returns {SchemaBuilder} - knex
 */
exports.up = (knex) => knex.schema
  .table(tableName, (table) => {
    table.dropColumn('duration');
  });

/**
 * Down
 *
 * @param {Knex} knex - knex
 * @returns {Knex} - knex
 */
exports.down = (knex) => knex.schema.table(tableName, (table) => {
  table.integer('duration')
    .notNullable()
    .defaultTo(60);
});
