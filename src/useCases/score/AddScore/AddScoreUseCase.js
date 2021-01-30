const config = require('../../../config/tennis');
const BusinessException = require('../../../exceptions/BusinessException');
const MatchRepository = require('../../../repositories/matchRepository');
const ScoreRepository = require('../../../repositories/scoreRepository');

class AddScoreUseCase {
  /**
   * AddScoreUseCase
   *
   * @class
   * @param {object} container - Container
   * @param container.broker
   * @param {ScoreRepository} container.scoreRepository - ScoreRepository
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, scoreRepository, broker }) {
    this.matchRepository = matchRepository;
    this.scoreRepository = scoreRepository;
    this.broker = broker;
  }

  async execute(match, fieldMap) {
    let matchLog = await this.scoreRepository.findMatchLogByMatchId(match.id);
    const playerData = this.getPlayerData(matchLog, fieldMap);

    await this.scoreRepository.removeOrphanScores(match.id, matchLog.scoreSequence);

    await this.scoreRepository.createScoreLog({
      matchId: match.id,
      sequence: matchLog.scoreSequence + 1,
      scoreType: fieldMap.Score_Type,
      set1A: fieldMap.Set1_A,
      set1B: fieldMap.Set1_B,
      set2A: fieldMap.Set2_A,
      set2B: fieldMap.Set2_B,
      set3A: fieldMap.Set3_A,
      set3B: fieldMap.Set3_B,
      scoreA: fieldMap.Score_A,
      scoreB: fieldMap.Score_B,
      currentSet: fieldMap.Current_Set,
      setsWonA: fieldMap.SetsWon_A,
      setsWonB: fieldMap.SetsWon_B,
      playerServing: fieldMap.Player_Serving,
      matchWinner: fieldMap.Match_Winner === 'null' ? null : fieldMap.Match_Winner,
      currentState: fieldMap.Current_State,
      ...playerData,
    });

    matchLog = await this.scoreRepository.updateMatchLog({
      matchId: match.id,
    }, {
      $inc: {
        scoreSequence: 1,
      },
      remainingUndos: Math.min(config.maxUndo, matchLog.remainingUndos + 1),
      remainingRedos: 0,
    });

    setTimeout(() => {
      this.broker.publish({
        topic: `${match.brokerTopic}/Can_Undo`,
        payload: Buffer.from(matchLog.remainingUndos > 0 ? 'true' : 'false'),
        qos: 2,
        retain: true,
      });

      this.broker.publish({
        topic: `${match.brokerTopic}/Can_Redo`,
        payload: Buffer.from(matchLog.remainingRedos > 0 ? 'true' : 'false'),
        qos: 2,
        retain: true,
      });
    }, [150]);
    // Não funciona se tirar o setTimeout...

    await this.addMessage(match, fieldMap, playerData);
  }

  getPlayerData(matchLog, fieldMap) {
    const playerScored = fieldMap.Player_Scored;

    if (playerScored === '0') {
      return {
        playerId: matchLog.player1Id,
        playerName: matchLog.player1Name,
      };
    }

    if (playerScored === '1') {
      return {
        playerId: matchLog.player2Id,
        playerName: matchLog.player2Name,
      };
    }

    throw new BusinessException('Player_Scored deve ser "0" ou "1"');
  }

  async addMessage(match, fieldMap, playerData) {
    const scoreType = fieldMap.Score_Type;

    const message = `${playerData.playerName} - ${scoreType}`;

    await this.scoreRepository.createMessageLog({
      matchId: match.id,
      message,
      type: scoreType,
    });

    this.broker.publish({
      topic: `${match.brokerTopic}/Message`,
      payload: Buffer.from(message),
      qos: 1,
    });
  }
}

module.exports = AddScoreUseCase;
