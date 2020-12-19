const ValidationException = require('../../../exceptions/ValidationException');
const CreateMatchUseCase = require('./CreateMatchUseCase');

class CreateMatchController {
  /**
   * CreateMatchController
   *
   * @class
   * @param {object} container - Container
   * @param {CreateMatchUseCase} container.createMatchUseCase - CreateMatchUseCase
   */
  constructor({ createMatchUseCase }) {
    this.createMatchUseCase = createMatchUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    const tokens = await this.createMatchUseCase.execute(academyId, request.body);

    return response.status(201).json(tokens);
  }
}

module.exports = CreateMatchController;
