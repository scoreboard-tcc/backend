const MatchRepository = require('../../../repositories/matchRepository');
const crypto = require('crypto');

class ListVirtualMatchesUseCase {
  /**
   * ListVirtualMatchesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository }) {
    this.matchRepository = matchRepository;
  }

  async execute(academyId, publishTokenHashes = []) {
    const matches = await this.matchRepository.findIngameVirtualMatchesByAcademyId(academyId);

    return this.addControlledByUserAttribute(matches, publishTokenHashes);
  }

  addControlledByUserAttribute(matches, publishTokenHashes) {
    return matches.map((match) => ({
      id: match.id,
      listed: match.listed,
      pin: match.pin,
      controlledByCurrentUser: this.checkIfScoreboardIsControlledByUser(match.publishToken, publishTokenHashes),
    }));
  }

  checkIfScoreboardIsControlledByUser(publishToken, publishTokenHashes) {
    const hashedPublishToken = crypto.createHash('sha1').update(publishToken).digest('hex');

    return publishTokenHashes.includes(hashedPublishToken);
  }
}

module.exports = ListVirtualMatchesUseCase;
