const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
const CreateCoordinatorUseCase = require('../../coordinator/CreateCoordinator/CreateCoordinatorUseCase');
const CreateScoreboardUseCase = require('../../scoreboard/CreateScoreboard/CreateScoreboardUseCase');
const UploadFileUseCase = require('../../utils/UploadFile/UploadFileUseCase');
const CheckIfSubdomainIsAvailableUseCase = require('../CheckIfSubdomainIsAvailable/CheckIfSubdomainIsAvailableUseCase');
const CreateAcademyValidator = require('./CreateAcademyValidator');

class CreateAcademyUseCase {
  /**
   * CreateAcademyUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {CreateCoordinatorUseCase} container.createCoordinatorUseCase - CreateCoordinatorUseCase
   * @param {CheckIfSubdomainIsAvailableUseCase} container.checkIfSubdomainIsAvailableUseCase - CheckIfSubdomainIsAvailableUseCase
   * @param {UploadFileUseCase} container.uploadFileUseCase - UploadFileUseCase
   * @param {CreateScoreboardUseCase} container.createScoreboardUseCase - CreateScoreboardUseCase
   */
  constructor({
    academyRepository, createScoreboardUseCase, createCoordinatorUseCase, checkIfSubdomainIsAvailableUseCase, uploadFileUseCase,
  }) {
    this.academyRepository = academyRepository;
    this.createScoreboardUseCase = createScoreboardUseCase;
    this.createCoordinatorUseCase = createCoordinatorUseCase;
    this.checkIfSubdomainIsAvailableUseCase = checkIfSubdomainIsAvailableUseCase;
    this.uploadFileUseCase = uploadFileUseCase;
  }

  validate(scoreboard) {
    validateSchema(CreateAcademyValidator, scoreboard);
  }

  async execute(request) {
    this.validate(request);

    await this.checkIfSubdomainIsAlreadyUsed(request.subdomain);

    const logoUrl = await this.uploadFileUseCase.execute(request.logo);

    const payload = {
      name: request.name,
      subdomain: request.subdomain,
      address: request.address,
      logoUrl,
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
