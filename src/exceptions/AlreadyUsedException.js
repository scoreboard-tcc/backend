const BusinessException = require('./BusinessException');

class AlreadyUsedException extends BusinessException {
  constructor(resource, field, id) {
    super(`Já existe um(a) ${resource} com o ${field} ${id} utilizado.`);
  }
}

module.exports = AlreadyUsedException;
