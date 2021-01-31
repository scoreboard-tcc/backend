const BusinessException = require('../../../exceptions/BusinessException');
const ScoreRepository = require('../../../repositories/scoreRepository');

class RedoScoreUseCase {
  /**
   * RedoScoreUseCase
   *
   * @class
   * @param {object} container - Container
   * @param container.broker
   * @param {ScoreRepository} container.scoreRepository - ScoreRepository
   */
  constructor({ broker, scoreRepository }) {
    this.broker = broker;
    this.scoreRepository = scoreRepository;
  }

  async execute(match) {
    let matchLog = await this.scoreRepository.findMatchLogByMatchId(match.id);

    if (matchLog.remainingRedos === 0) {
      throw new BusinessException('Não é possível refazer a jogada');
    }

    const nextScore = await this.scoreRepository.findScoreLog({
      matchId: match.id,
      sequence: matchLog.scoreSequence + 1,
    });

    matchLog = await this.scoreRepository.updateMatchLog({
      matchId: match.id,
    }, {
      $inc: {
        remainingUndos: 1,
        scoreSequence: 1,
        remainingRedos: -1,
      },
    });

    this.publishScore(match, matchLog, nextScore);
    this.addMessage(match);

    return {
      canUndo: matchLog.remainingUndos > 0,
      canRedo: matchLog.remainingRedos > 0,
    };
  }

  async publishScore(match, matchLog, scoreLog) {
    const topicMap = {
      Set1_A: scoreLog.set1A,
      Set1_B: scoreLog.set1B,
      Set2_A: scoreLog.set2A,
      Set2_B: scoreLog.set2B,
      Set3_A: scoreLog.set3A,
      Set3_B: scoreLog.set3B,
      Score_A: scoreLog.scoreA,
      Score_B: scoreLog.scoreB,
      Current_Set: scoreLog.currentSet,
      SetsWon_A: scoreLog.setsWonA,
      SetsWon_B: scoreLog.setsWonB,
      Player_Serving: scoreLog.playerServing,
      Match_Winner: scoreLog.matchWinner,
      Current_State: scoreLog.currentState,
      Can_Undo: matchLog.remainingUndos > 0 ? 'true' : 'false',
      Can_Redo: matchLog.remainingRedos > 0 ? 'true' : 'false',
    };

    Object.entries(topicMap)
      .forEach(([topic, value]) => this.broker.publish({
        topic: `${match.brokerTopic}/${topic}`,
        payload: Buffer.from(value === null || value === undefined
          ? 'null'
          : value.toString()),
        qos: 1,
        retain: true,
      }));
  }

  async addMessage(match) {
    const message = 'A jogada foi refeita.';

    await this.scoreRepository.createMessageLog({
      matchId: match.id,
      message,
      type: 'undo',
    });

    this.broker.publish({
      topic: `${match.brokerTopic}/Message`,
      payload: Buffer.from(message),
      qos: 1,
      retain: true,
    });
  }
}

module.exports = RedoScoreUseCase;
