const CreatePlayerUseCase = require('../../../useCases/player/CreatePlayer/CreatePlayerUseCase');

class CreatePlayerController {
  /**
   * CreatePlayerController
   *
   * @class
   * @param {object} container - Container
   * @param {CreatePlayerUseCase} container.createPlayerUseCase - CreateCoordinatorUseCase
   */
  constructor({ createPlayerUseCase }) {
    this.createPlayerUseCase = createPlayerUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;
    const player = await this.createPlayerUseCase.execute(request.body, academyId);

    return response.status(201).json(player);
  }
}

module.exports = CreatePlayerController;
