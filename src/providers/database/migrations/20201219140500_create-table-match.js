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
  .createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();

    table
      .integer('academyId')
      .notNullable()
      .references('id')
      .inTable('Academy');

    table
      .integer('scoreboardId')
      .references('id')
      .inTable('Scoreboard');

    table
      .string('brokerTopic')
      .notNullable();

    table
      .timestamp('startedAt')
      .defaultTo(knex.fn.now());

    table.integer('duration')
      .notNullable()
      .defaultTo(60);

    table
      .enu('status', ['INGAME', 'FINISHED'])
      .notNullable()
      .defaultTo('INGAME');

    table
      .integer('player1Id')
      .references('id')
      .inTable('Player');

    table
      .integer('player2Id')
      .references('id')
      .inTable('Player');

    table
      .string('player1Name')
      .defaultTo('Jogador 1');

    table
      .string('player2Name')
      .defaultTo('Jogador 2');

    table
      .boolean('listed')
      .notNullable()
      .defaultTo(true);

    table
      .string('pin');

    table
      .string('publishToken')
      .notNullable();

    table
      .string('refreshToken')
      .notNullable();

    table
      .string('subscribeToken');

    // TODO: estado da partida (pontuação)
  });

/**
 * Down
 *
 * @param {Knex} knex - knex
 * @returns {Knex} - knex
 */
exports.down = (knex) => knex.schema.dropTable(tableName);
