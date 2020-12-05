const Knex = require('knex');
const asyncLocalStorage = require('../../utils/asyncLocalStorage');
const knexConfig = require('../../../knexfile').development;
const { attachPaginate } = require('knex-paginate');

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
