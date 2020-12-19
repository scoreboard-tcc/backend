const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const crypto = require('crypto');

class ListScoreboardWithMatchesUseCase {
  /**
   * ListScoreboardWithMatchesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ scoreboardRepository }) {
    this.scoreboardRepository = scoreboardRepository;
  }

  async execute(academyId, publishTokenHashes = []) {
    const scoreboards = await this.scoreboardRepository.findByAcademyIdWithMatches(academyId);

    return this.addControlledByUserAttribute(scoreboards, publishTokenHashes);
  }

  addControlledByUserAttribute(scoreboards, publishTokenHashes) {
    return scoreboards.map((scoreboard) => ({
      ...scoreboard,
      match: scoreboard.match ? {
        id: scoreboard.match.id,
        listed: scoreboard.match.listed,
        pin: scoreboard.match.pin,
        controlledByCurrentUser: this.checkIfScoreboardIsControlledByUser(scoreboard.match.publishToken, publishTokenHashes),
      } : null,
    }));
  }

  checkIfScoreboardIsControlledByUser(publishToken, publishTokenHashes) {
    const hashedPublishToken = crypto.createHash('sha1').update(publishToken).digest('hex');

    return publishTokenHashes.includes(hashedPublishToken);
  }
}

module.exports = ListScoreboardWithMatchesUseCase;
