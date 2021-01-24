const BusinessException = require('../../../exceptions/BusinessException');
const ScoreRepository = require('../../../repositories/scoreRepository');

class UndoScoreUseCase {
  /**
   * UndoScoreUseCase
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
    const matchLog = await this.scoreRepository.findMatchLogByMatchId(match.id);

    if (matchLog.remainingUndos === 0) {
      throw new BusinessException('Não é possível desfazer a jogada');
    }

    const previousScore = await this.scoreRepository.findScoreLog({
      sequence: matchLog.scoreSequence - 1,
    });

    this.publishScore(match, previousScore);
    this.addMessage(match);

    await this.scoreRepository.updateMatchLog({
      matchId: match.id,
    }, {
      $inc: {
        remainingUndos: -1,
        scoreSequence: -1,
        remainingRedos: 1,
      },
    });

    return matchLog.remainingUndos > 1;
  }

  async publishScore(match, scoreLog) {
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
    };

    Object.entries(topicMap)
      .forEach(([topic, value]) => this.broker.publish({
        topic: `${match.brokerTopic}/${topic}`,
        payload: Buffer.from(value.toString()),
        qos: 1,
        retain: true,
      }));
  }

  async addMessage(match) {
    const message = 'A jogada foi desfeita (TODO: melhorar)';

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

module.exports = UndoScoreUseCase;
