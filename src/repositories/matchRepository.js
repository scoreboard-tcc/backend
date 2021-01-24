const createQuery = require('../providers/database');
const { create } = require('../providers/mongo/schema/MatchLog');

const tableName = 'Match';

class MatchRepository {
  async create(match) {
    return createQuery(tableName)
      .insert(match)
      .returning('id');
  }

  async findIngameVirtualMatchesByAcademyId(academyId) {
    const pin = '"Match"."pin" is not null as pin';

    return createQuery(tableName)
      .select('id', 'listed', 'brokerTopic', 'player1Name', 'player2Name', createQuery.knexInstance.raw(pin))
      .where('academyId', '=', academyId)
      .whereNull('scoreboardId')
      .andWhere('status', '=', 'INGAME');
  }

  async findListedInGameMatchesByAcademyId(academyId) {
    const pin = '"Match"."pin" is not null as pin';

    const data = await createQuery(tableName)
      .select('Match.id', 'Match.brokerTopic', createQuery.knexInstance.raw(pin),
        'Scoreboard.id as scoreboardId', 'Scoreboard.description as scoreboardDescription', 'Match.player1Name', 'Match.player2Name')
      .leftJoin('Scoreboard', 'Match.scoreboardId', 'Scoreboard.id')
      .where('Match.academyId', '=', academyId)
      .andWhere('status', '=', 'INGAME')
      .andWhere('Match.listed', '=', true);

    return data.map((result) => ({
      id: result.id,
      brokerTopic: result.pin ? null : result.brokerTopic,
      pin: result.pin,
      player1Name: result.player1Name,
      player2Name: result.player2Name,
      scoreboard: result.scoreboardId ? {
        id: result.scoreboardId,
        description: result.scoreboardDescription,
      } : null,
    }));
  }

  async findByRefreshToken(refreshToken) {
    return createQuery(tableName)
      .where('refreshToken', '=', refreshToken)
      .first();
  }

  async updateTokens(id, { publishToken, refreshToken }) {
    return createQuery(tableName)
      .update({ publishToken, refreshToken })
      .where('id', '=', id);
  }

  async findByAcademyIdAndMatchId(academyId, matchId) {
    return createQuery(tableName)
      .where('academyId', '=', academyId)
      .andWhere('matchId', '=', matchId)
      .first();
  }

  async findByMatchIdAndIngame(matchId) {
    const pin = '"Match"."pin" is not null as pin';

    const match = await createQuery(tableName)
      .select('Match.id as id', 'player1Name', 'player2Name', 'player1Id', 'player2Id', 'brokerTopic', 'startedAt',
        'duration',
        'scoreboardId',
        'description',
        'tieBreakType',
        'scoringType',
        'hasAdvantage',
        createQuery.knexInstance.raw(pin))
      .leftJoin('Scoreboard', 'Match.scoreboardId', 'Scoreboard.id')
      .where('Match.id', '=', matchId)
      .andWhere('status', '=', 'INGAME')
      .first();

    if (!match) {
      return null;
    }

    if (match.pin) {
      delete match.brokerTopic;
    }

    return ({
      id: match.id,
      description: match.description || `Partida ${match.id}`,
      brokerTopic: match.brokerTopic,
      startedAt: match.startedAt,
      duration: match.duration,
      player1Id: match.player1Id,
      player2Id: match.player2Id,
      player1Name: match.player1Name,
      player2Name: match.player2Name,
      tieBreakType: match.tieBreakType,
      scoringType: match.scoringType,
      hasAdvantage: match.hasAdvantage,
      scoreboard: match.scoreboardId ? {
        id: match.scoreboardId,
      } : null,
    });
  }

  async findMatchByBrokerTopicAndPublishTokenAndIngame(brokerTopic, publishToken) {
    return createQuery(tableName)
      .select('id')
      .where('brokerTopic', '=', brokerTopic)
      .andWhere('publishToken', '=', publishToken)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  async findMatchByBrokerTopicAndIngame(brokerTopic) {
    return createQuery(tableName)
      .select('id')
      .where('brokerTopic', '=', brokerTopic)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  async findMatchByPublishTokenAndIngame(publishToken) {
    return createQuery(tableName)
      .select('id', 'brokerTopic')
      .andWhere('publishToken', '=', publishToken)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  async findByScoreboardIdAndIngame(scoreboardId) {
    return createQuery(tableName)
      .select('duration', 'brokerTopic')
      .where('scoreboardId', '=', scoreboardId)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  async findByBrokerTopicAndIngame(brokerTopic) {
    return createQuery(tableName)
      .where('brokerTopic', '=', brokerTopic)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  async findByMatchIdAndPinAndIngame(matchId, pin) {
    return createQuery(tableName)
      .select('id', 'brokerTopic', 'startedAt', 'duration')
      .where('id', '=', matchId)
      .andWhere('pin', '=', pin)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  async findMatchBySerialNumberOrBrokerTopic(topic) {
    return createQuery(tableName)
      .select('*', 'Match.id as id')
      .leftJoin('Scoreboard', 'Match.scoreboardId', 'Scoreboard.id')
      .andWhere('Match.status', '=', 'INGAME')
      .andWhere((q) => q.where('Scoreboard.serialNumber', '=', topic)
        .orWhere('Match.brokerTopic', '=', topic))
      .first();
  }

  async updateMatchById(id, data) {
    return createQuery(tableName)
      .update(data)
      .where('id', '=', id);
  }

  async findByIngame() {
    const data = await createQuery(tableName)
      .select('*', 'Match.id as id')
      .leftJoin('Scoreboard', 'Match.scoreboardId', 'Scoreboard.id')
      .andWhere('status', '=', 'INGAME');

    return data.map((match) => ({
      id: match.id,
      brokerTopic: match.brokerTopic,
      startedAt: match.startedAt,
      duration: match.duration,
      scoreboard: match.scoreboardId ? {
        id: match.scoreboardId,
        serialNumber: match.serialNumber,
      } : null,
    }));
  }
}

module.exports = MatchRepository;
