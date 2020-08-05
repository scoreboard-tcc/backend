const Knex = require('knex');
const { attachPaginate } = require('knex-paginate');
const knexConfig = require('../../../knexfile').development;

attachPaginate();

module.exports = Knex(knexConfig);
