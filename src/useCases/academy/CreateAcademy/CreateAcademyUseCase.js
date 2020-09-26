const AcademyRepository = require('../../../repositories/academyRepository');
const CreateScoreboardUseCase = require('../CreateScoreboard/CreateScoreboardUseCase');
const validateSchema = require('../../../utils/validation');
const CreateAcademyValidator = require('./CreateAcademyValidator');
const CreateCoordinatorUseCase = require('../CreateCoordinator/CreateCoordinatorUseCase');
const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');

class CreateAcademyUseCase {
  /**
   * CreateAcademyUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {CreateCoordinatorUseCase} container.createCoordinatorUseCase - CreateCoordinatorUseCase
   * @param {CreateScoreboardUseCase} container.createScoreboardUseCase - CreateScoreboardUseCase
   */
  constructor({ academyRepository, createScoreboardUseCase, createCoordinatorUseCase }) {
    this.academyRepository = academyRepository;
    this.createScoreboardUseCase = createScoreboardUseCase;
    this.createCoordinatorUseCase = createCoordinatorUseCase;
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
    const academy = await this.academyRepository.findBySubdomain(subdomain);

    if (academy) throw new AlreadyUsedException('Academia', 'subdomain', subdomain);
  }
}

module.exports = CreateAcademyUseCase;
