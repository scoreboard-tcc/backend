const keyv = require('../../../providers/keyv');
const { ScoreLog, MatchLog, MessageLog } = require('../../../providers/mongo/schema');
const MatchRepository = require('../../../repositories/matchRepository');

class AddScoreUseCase {
  /**
   * AddScoreUseCase
   *
   * @class
   * @param {object} container - Container
   * @param container.broker
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, broker }) {
    this.matchRepository = matchRepository;
    this.broker = broker;
  }

  async execute(topic, fieldMap) {
    const match = await this.findMatchByTopic(topic);

    await this.removeOrphanScores(match);

    const nextSequence = await this.findNextSequence(match);

    if (!nextSequence) {
      return;
    }

    await this.addScore(nextSequence, match, fieldMap);
    await this.updateScoreSequence(match);
    await this.addMessage(match, fieldMap);
  }

  async findMatchByTopic(topic) {
    let match = await this.matchRepository.findByBrokerTopicAndIngame(topic);

    if (match) {
      return match;
    }

    const matchTopic = await keyv.get(topic);

    match = await this.matchRepository.findByBrokerTopicAndIngame(matchTopic);

    if (!match) {
      throw new Error('Partida não encontrada');
    }

    return match;
  }

  async findNextSequence(match) {
    const [score] = await ScoreLog
      .find({ matchId: match.id })
      .sort({ sequence: -1 })
      .limit(1);

    return score.sequence + 1;
  }

  async removeOrphanScores(match) {
    const { scoreSequence } = await MatchLog
      .findOne({ matchId: match.id });

    await ScoreLog.deleteMany({
      matchId: match.id,
      sequence: {
        $gt: scoreSequence,
      },
    });
  }

  async addScore(sequence, match, fieldMap) {
    await ScoreLog.create({
      matchId: match.id,
      sequence,
      playerId: fieldMap.Who_Scored,
      scoreType: fieldMap.Score_Type,
      Set1A: fieldMap.Set1_A,
      Set1B: fieldMap.Set1_B,
      Set2A: fieldMap.Set2_A,
      Set2B: fieldMap.Set2_B,
      Set3A: fieldMap.Set3_A,
      Set3B: fieldMap.Set3_B,
      ScoreA: fieldMap.Score_A,
      ScoreB: fieldMap.Score_B,
      CurrentSet: fieldMap.Current_Set,
      SetsWonA: fieldMap.SetsWon_A,
      SetsWonB: fieldMap.SetsWon_B,
      PlayerServing: fieldMap.Player_Serving,
    });
  }

  async updateScoreSequence(match) {
    await MatchLog.updateOne({
      matchId: match.id,
    }, {
      $inc: {
        scoreSequence: 1,
      },
    });
  }

  async addMessage(match, fieldMap) {
    // TODO: customizar mensagens
    // - tipo do ponto (ace, ...)
    // - término do game
    // - término do set
    // - término da partida
    // - mudança de saque
    const message = `${fieldMap.Who_Scored_Name} fez um ponto!`;

    await MessageLog.create({
      matchId: match.id,
      playerId: fieldMap.Who_Scored,
      message,
      type: 'score',
    });

    this.broker.publish({
      topic: `${match.brokerTopic}/Message`,
      payload: Buffer.from(message),
      qos: 1,
      retain: true,
    });
  }
}

module.exports = AddScoreUseCase;
