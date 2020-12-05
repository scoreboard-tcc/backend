const express = require('express');

/**
 * @param {express.Response} response - Resposta express
 * @param {string} type - "administrator" ou "coordinator"
 * @returns {boolean} - true se usuário está autenticado
 */
function isAuthenticated(response, type) {
  return response && response.locals
    && response.locals.user && response.locals.user.type === type;
}

/**
 * @param {express.Response} response - Resposta express
 * @returns {boolean} - true se usuário autenticado é admin
 */
function isAdminAuthenticated(response) {
  return isAuthenticated(response, 'administrator');
}

/**
 * @param {express.Response} response - Resposta express
 * @returns {boolean} - true se usuário autenticado é coordenador
 */
function isCoordinatorAuthenticated(response) {
  return isAuthenticated(response, 'coordinator');
}

module.exports = {
  isAdminAuthenticated,
  isCoordinatorAuthenticated,
};
