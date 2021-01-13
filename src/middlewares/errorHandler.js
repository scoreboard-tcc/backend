/* eslint-disable */

const asyncLocalStorage = require("../utils/asyncLocalStorage");

async function errorHandler(error, request, response, next) {
  // const transaction = asyncLocalStorage.getStore();

  // if (transaction) await transaction.rollback();

  const {message = 'Erro desconhecido', status = 500} = error

  console.error({message})

  return response.status(status).json({message});
}

module.exports = errorHandler;
