const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
const CreateAcademyValidator = require('./CreateAcademyValidator');
const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const CheckIfSubdomainIsAvailableUseCase = require('../CheckIfSubdomainIsAvailable/CheckIfSubdomainIsAvailableUseCase');
const CreateCoordinatorUseCase = require('../../coordinator/CreateCoordinator/CreateCoordinatorUseCase');
const CreateScoreboardUseCase = require('../../scoreboard/CreateScoreboard/CreateScoreboardUseCase');

class CreateAcademyUseCase {
  /**
   * CreateAcademyUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {CreateCoordinatorUseCase} container.createCoordinatorUseCase - CreateCoordinatorUseCase
   * @param {CheckIfSubdomainIsAvailableUseCase} container.checkIfSubdomainIsAvailableUseCase - CheckIfSubdomainIsAvailableUseCase
   * @param {CreateScoreboardUseCase} container.createScoreboardUseCase - CreateScoreboardUseCase
   */
  constructor({
    academyRepository, createScoreboardUseCase, createCoordinatorUseCase, checkIfSubdomainIsAvailableUseCase,
  }) {
    this.academyRepository = academyRepository;
    this.createScoreboardUseCase = createScoreboardUseCase;
    this.createCoordinatorUseCase = createCoordinatorUseCase;
    this.checkIfSubdomainIsAvailableUseCase = checkIfSubdomainIsAvailableUseCase;
  }

  validate(scoreboard) {
    validateSchema(CreateAcademyValidator, scoreboard);
  }

  async execute(request) {
    this.validate(request);

    await this.checkIfSubdomainIsAlreadyUsed(request.subdomain);

    const payload = {
      name: request.name,
      subdomain: request.subdomain,
      address: request.address,
      logoUrl: 'https://uilogos.co/img/logomark/hexa.png',
    };

    const [academyId] = await this.academyRepository.create(payload);

    await this.createScoreboardUseCase.execute(academyId, request.scoreboards);
    await this.createCoordinatorUseCase.execute(academyId, request.coordinator);
  }

  async checkIfSubdomainIsAlreadyUsed(subdomain) {
    const isAvailable = await this.checkIfSubdomainIsAvailableUseCase.execute(subdomain);

    if (!isAvailable) throw new AlreadyUsedException('Academia', 'subdomain', subdomain);
  }
}

module.exports = CreateAcademyUseCase;
