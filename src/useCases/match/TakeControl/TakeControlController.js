const ValidationException = require('../../../exceptions/ValidationException');
const TakeControlUseCase = require('./TakeControlUseCase');

class TakeControlController {
  /**
   * TakeControlController
   *
   * @class
   * @param {object} container - Container
   * @param {TakeControlUseCase} container.takeControlUseCase - TakeControlUseCase
   */
  constructor({ takeControlUseCase }) {
    this.takeControlUseCase = takeControlUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;
    const { matchId } = request.body;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    const tokens = await this.takeControlUseCase.execute(academyId, matchId);

    return response.status(200).json(tokens);
  }
}

module.exports = TakeControlController;
