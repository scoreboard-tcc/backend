const AcademyRepository = require('../../../repositories/academyRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
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
   * @param {SearchScoreboardsValidator} container.searchScoreboardsValidator
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({
    academyRepository, scoreboardRepository, getAcademyByIdUseCase, searchScoreboardsValidator,
  }) {
    this.academyRepository = academyRepository;
    this.scoreboardRepository = scoreboardRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.searchScoreboardsValidator = searchScoreboardsValidator;
  }

  async execute(academyId, search, pagination) {
    this.searchScoreboardsValidator.validate(search);

    await this.getAcademyByIdUseCase.execute(academyId);

    return this.scoreboardRepository.findByAcademyAndDescription(academyId, search, pagination);
  }
}

module.exports = SearchScoreboardsUseCase;
