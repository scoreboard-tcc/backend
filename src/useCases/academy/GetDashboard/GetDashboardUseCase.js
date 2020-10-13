const AcademyRepository = require('../../../repositories/academyRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');

class GetDashboardUseCase {
  /**
   * GetDashboardUseCase
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

  async execute() {
    const { count: academyCount } = await this.academyRepository.count();
    const { count: scoreboardCount } = await this.scoreboardRepository.count();

    return { academyCount, scoreboardCount };
  }
}

module.exports = GetDashboardUseCase;
