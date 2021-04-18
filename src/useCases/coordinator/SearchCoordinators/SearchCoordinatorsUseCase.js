const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const SearchCoordinatorsValidator = require('./SearchCoordinatorsValidator');

class SearchCoordinatorsUseCase {
  /**
   * SearchScoreboardsUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {SearchCoordinatorsValidator} container.searchCoordinatorsValidator
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ academyRepository, coordinatorRepository, searchCoordinatorsValidator }) {
    this.academyRepository = academyRepository;
    this.coordinatorRepository = coordinatorRepository;
    this.searchCoordinatorsValidator = searchCoordinatorsValidator;
  }

  async execute(academyId, search, pagination) {
    this.searchCoordinatorsValidator.validate({ academyId, search });

    await this.checkIfAcademyExists(academyId);

    return this.coordinatorRepository.findByAcademyAndName(academyId, search, pagination);
  }

  async checkIfAcademyExists(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('academia', 'id', id);
  }
}

module.exports = SearchCoordinatorsUseCase;
