const MatchRepository = require('../../../repositories/matchRepository');
const GetMatchByIdUseCase = require('../GetMatchById/GetMatchByIdUseCase');

class FinishMatchUseCase {
  /**
   * FinishMatchUseCase
   *
   * @class
   * @param {object} container - Container
   * @param container.broker
   * @param {GetMatchByIdUseCase} container.getMatchByIdUseCase - GetMatchByIdUseCase
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, broker, getMatchByIdUseCase }) {
    this.matchRepository = matchRepository;
    this.broker = broker;
    this.getMatchByIdUseCase = getMatchByIdUseCase;
  }

  async execute(match) {
    await this.matchRepository.updateMatchById(match.id, {
      status: 'FINISHED',
    });

    this.clearRetainedMessages(match.brokerTopic);

    if (match.scoreboard) {
      this.clearRetainedMessages(match.scoreboard.serialNumber);
    }
  }

  async executeByMatchId(matchId) {
    const match = await this.getMatchByIdUseCase.execute(matchId);

    return await this.execute(match);
  }

  clearRetainedMessages(brokerTopic) {
    const topics = [
      'Set1_A',
      'Set1_B',
      'Set2_A',
      'Set2_B',
      'Set3_A',
      'Set3_B',
      'Score_A',
      'Score_B',
      'Current_Set',
      'SetsWon_A',
      'SetsWon_B',
      'Controller_Sequence',
      'Player_Serving',
      'Match_Winner',
      'Current_State'];

    topics.forEach((topic) => this.broker.publish({
      topic: `${brokerTopic}/${topic}`,
      payload: null,
      qos: 1,
      retain: true,
    }));
  }
}

module.exports = FinishMatchUseCase;
