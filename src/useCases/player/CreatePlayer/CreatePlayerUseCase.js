const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const AcademyRepository = require('../../../repositories/academyRepository');
const PlayerRepository = require('../../../repositories/playerRepository');
const GetAcademyByIdUseCase = require('../../academy/GetAcademyById/GetAcademyByIdUseCase');
const LinkPlayerToAcademyUseCase = require('../LinkPlayerToAcademy/LinkPlayerToAcademyUseCase');
const CreatePlayerValidator = require('./CreatePlayerValidator');

class CreatePlayerUseCase {
  /**
   * CreatePlayerUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {PlayerRepository} container.playerRepository - PlayerRepository
   * @param {LinkPlayerToAcademyUseCase} container.linkPlayerToAcademyUseCase - LinkPlayerToAcademyUseCase
   * @param {CreatePlayerValidator} container.createPlayerValidator
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   */
  constructor({
    playerRepository, academyRepository, getAcademyByIdUseCase, linkPlayerToAcademyUseCase, createPlayerValidator,
  }) {
    this.playerRepository = playerRepository;
    this.academyRepository = academyRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.linkPlayerToAcademyUseCase = linkPlayerToAcademyUseCase;
    this.createPlayerValidator = createPlayerValidator;
  }

  async execute(request, academyId) {
    this.createPlayerValidator.validate(request);

    await this.checkIfEmailIsAlreadyUsed(request.email);
    const playerId = await this.createPlayer(request);

    if (academyId) {
      await this.linkPlayerToAcademyUseCase.execute({ academyId, playerId });
    }

    return playerId;
  }

  async checkIfEmailIsAlreadyUsed(email) {
    const player = await this.playerRepository.findByEmail(email);

    if (player) throw new AlreadyUsedException('jogador', 'email', email);
  }

  async createPlayer(player) {
    const [id] = await this.playerRepository.create({
      email: player.email,
      name: player.name,
    });

    return id;
  }
}

module.exports = CreatePlayerUseCase;
