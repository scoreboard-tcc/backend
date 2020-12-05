const AcademyRepository = require('../../../repositories/academyRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const validateSchema = require('../../../utils/validation');
const GetAcademyByIdUseCase = require('../../academy/GetAcademyById/GetAcademyByIdUseCase');
const SearchScoreboardsValidator = require('./SearchScoreboardsValidator');

class SearchScoreboardsUseCase {
  /**
   * SearchScoreboardsUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ academyRepository, scoreboardRepository, getAcademyByIdUseCase }) {
    this.academyRepository = academyRepository;
    this.scoreboardRepository = scoreboardRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
  }

  validate(academyId, search) {
    validateSchema(SearchScoreboardsValidator.academyId, academyId);
    validateSchema(SearchScoreboardsValidator.search, search);
  }

  async execute(academyId, search, pagination) {
    this.validate(academyId, search);

    await this.getAcademyByIdUseCase.execute(academyId);

    return this.scoreboardRepository.findByAcademyAndDescription(academyId, search, pagination);
  }
}

module.exports = SearchScoreboardsUseCase;
