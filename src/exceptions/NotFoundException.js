const BusinessException = require('./BusinessException');

class NotFoundException extends BusinessException {
  constructor(resource, field, id) {
    super(`Não existe um(a) ${resource} com o ${field} ${id}.`, 404);
  }
}

module.exports = NotFoundException;
