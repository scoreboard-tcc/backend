const Knex = require('knex');
const { attachPaginate } = require('knex-paginate');
const knexConfig = require('../../../knexfile').development;
const asyncLocalStorage = require('../../utils/asyncLocalStorage');

attachPaginate();

const knex = Knex(knexConfig);

/**
 * @param tableName
 */
function createQuery(tableName) {
  const transaction = asyncLocalStorage.getStore();

  if (transaction) {
    return knex
      .table(tableName)
      .transacting(transaction);
  }

  return knex
    .table(tableName);
}

module.exports = createQuery;
module.exports.knexInstance = knex;
