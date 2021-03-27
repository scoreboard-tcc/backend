const Knex = require('knex');
const { attachPaginate } = require('knex-paginate');
const knexConfig = require('../../../knexfile').development;

attachPaginate();

const knex = Knex(knexConfig);

/**
 * @param tableName
 */
function createQuery(tableName) {
  return knex
    .table(tableName);
}

module.exports = createQuery;
module.exports.knexInstance = knex;
