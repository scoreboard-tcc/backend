const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const validateSchema = require('../../../utils/validation');
const SearchScoreboardsValidator = require('./SearchScoreboardsValidator');

class SearchScoreboardsUseCase {
  /**
   * SearchScoreboardsUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ academyRepository, scoreboardRepository }) {
    this.academyRepository = academyRepository;
    this.scoreboardRepository = scoreboardRepository;
  }

  validate(request) {
    validateSchema(SearchScoreboardsValidator, request);
  }

  async execute(academyId, search, pagination) {
    this.validate({ academyId, search });

    await this.checkIfAcademyExists(academyId);

    return this.scoreboardRepository.findByAcademyAndDescription(academyId, search, pagination);
  }

  async checkIfAcademyExists(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('academia', 'id', id);
  }
}

module.exports = SearchScoreboardsUseCase;
