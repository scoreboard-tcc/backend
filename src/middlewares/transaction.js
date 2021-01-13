const { knexInstance } = require('../providers/database');
const asyncLocalStorage = require('../utils/asyncLocalStorage');

/**
 * @param req
 * @param res
 * @param next
 */
async function transactionMiddleware(req, res, next) {
  const transaction = await knexInstance.transaction();

  // asyncLocalStorage.run(transaction, () => {
  //   next();
  // });
}

/**
 * @param req
 * @param res
 * @param next
 */
async function postRequestMiddleware(req, res, next) {
  console.log('after');

  // const transaction = asyncLocalStorage.getStore();

  // if (transaction) await transaction.commit();
}

module.exports = { transactionMiddleware, postRequestMiddleware };
