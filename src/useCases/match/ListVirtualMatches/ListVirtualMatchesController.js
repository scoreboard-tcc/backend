const ValidationException = require('../../../exceptions/ValidationException');
const ListVirtualMatchesUseCase = require('./ListVirtualMatchesUseCase');

class ListVirtualMatchesController {
  /**
   * ListVirtualMatchesController
   *
   * @class
   * @param {object} container - Container
   * @param {ListVirtualMatchesUseCase} container.listVirtualMatchesUseCase - ListVirtualMatchesUseCase
   */
  constructor({ listVirtualMatchesUseCase }) {
    this.listVirtualMatchesUseCase = listVirtualMatchesUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;
    const { publishTokenHashes } = request.params;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    const scoreboards = await this.listVirtualMatchesUseCase.execute(academyId, publishTokenHashes);

    return response.status(200).json(scoreboards);
  }
}

module.exports = ListVirtualMatchesController;
