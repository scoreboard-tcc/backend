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

    const lastScore = await this.scoreRepository.findScoreLog({
      matchId: match.id,
      sequence: matchLog.scoreSequence,
    });

    const newScore = {
      scoreType: fieldMap.Score_Type,
      set1A: Number(fieldMap.Set1_A),
      set1B: Number(fieldMap.Set1_B),
      set2A: Number(fieldMap.Set2_A),
      set2B: Number(fieldMap.Set2_B),
      set3A: Number(fieldMap.Set3_A),
      set3B: Number(fieldMap.Set3_B),
      scoreA: fieldMap.Score_A,
      scoreB: fieldMap.Score_B,
      currentSet: Number(fieldMap.Current_Set),
      setsWonA: Number(fieldMap.SetsWon_A),
      setsWonB: Number(fieldMap.SetsWon_B),
      matchWinner: fieldMap.Match_Winner === 'null' ? null : fieldMap.Match_Winner,
      ...playerData,
    };

    await this.scoreRepository.createScoreLog({
      matchId: match.id,
      sequence: matchLog.scoreSequence + 1,
      playerServing: fieldMap.Player_Serving === 'null' ? null : fieldMap.Player_Serving,
      currentState: fieldMap.Current_State,
      ...newScore,
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
    }, [200]);
    // Não funciona se tirar o setTimeout...

    await this.addMessages(match, playerData, lastScore, newScore, matchLog);
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

  async addMessages(match, fieldMap, lastScore, newScore, matchLog) {
    const scoreType = fieldMap.Score_Type;

    await this.addMessage(match, this.getMessageByScoreType(newScore), scoreType);
    await this.addMessageIfGameHasEnded(match, lastScore, newScore, matchLog);
    await this.addMessageIfSetHasEnded(match, lastScore, newScore, matchLog);
    await this.addMessageIfMatchHasEnded(match, newScore, matchLog);
  }

  async addMessage(match, message, type) {
    await this.scoreRepository.createMessageLog({
      matchId: match.id,
      message,
      type,
    });

    this.broker.publish({
      topic: `${match.brokerTopic}/Message`,
      payload: Buffer.from(message),
      qos: 1,
    });
  }

  async addMessageIfGameHasEnded(match, lastScore, newScore, matchLog) {
    if (newScore.set1A > lastScore.set1A
      || newScore.set2A > lastScore.set2A
      || newScore.set3A > lastScore.set3A) {
      await this.addMessage(match,
        `${matchLog.player1Name} venceu o game!`,
        'SYSTEM');

      return;
    }

    if (newScore.set1B > lastScore.set1B
      || newScore.set2B > lastScore.set2B
      || newScore.set3B > lastScore.set3B) {
      await this.addMessage(match,
        `${matchLog.player2Name} venceu o game!`,
        'SYSTEM');
    }
  }

  async addMessageIfSetHasEnded(match, lastScore, newScore, matchLog) {
    if (newScore.currentSet <= lastScore.currentSet) {
      return;
    }

    if (newScore.setsWonA > lastScore.setsWonA) {
      await this.addMessage(match,
        `${matchLog.player1Name} venceu o set!`,
        'SYSTEM');
      return;
    }

    if (newScore.setsWonB > lastScore.setsWonB) {
      await this.addMessage(match,
        `${matchLog.player2Name} venceu o set!`,
        'SYSTEM');
    }
  }

  async addMessageIfMatchHasEnded(match, newScore, matchLog) {
    if (newScore.matchWinner === '0') {
      await this.addMessage(match,
        `${matchLog.player1Name} venceu a partida!`,
        'SYSTEM');
      return;
    }

    if (newScore.matchWinner === '1') {
      await this.addMessage(match,
        `${matchLog.player2Name} venceu a partida!`,
        'SYSTEM');
    }
  }

  getMessageByScoreType(newScore) {
    const messageMap = {
      SCORE: `${newScore.playerName} fez um ponto.`,
      WINNER: `${newScore.playerName} fez um winner!`,
      ACE: `${newScore.playerName} fez um ace!`,
      DOUBLE_FAULT: `${newScore.playerName} pontuou por uma dupla-falta do adversário.`,
    };

    return messageMap[newScore.scoreType];
  }
}

module.exports = AddScoreUseCase;
