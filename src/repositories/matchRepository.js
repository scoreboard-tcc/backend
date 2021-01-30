const createQuery = require('../providers/database');

const tableName = 'Match';

const pinQuery = createQuery.knexInstance.raw('"Match"."pin" is not null as pin');

class MatchRepository {
  // Criar partida
  // Acesso: coordenador
  async create(match) {
    return createQuery(tableName)
      .insert(match)
      .returning('id');
  }

  // Listar as partidas em andamento sem placar de uma academia
  // Acesso: coordenador
  async findIngameVirtualMatchesByAcademyId(academyId) {
    return createQuery(tableName)
      .select('id', 'listed', 'brokerTopic', 'player1Name', 'player2Name', pinQuery)
      .where('academyId', '=', academyId)
      .whereNull('scoreboardId')
      .andWhere('status', '=', 'INGAME');
  }

  // Listar as partidas em andamento de uma academia
  // Não retorna o brokerTopic se a partida tiver pin
  // Acesso: público
  async findListedInGameMatchesByAcademyId(academyId) {
    const data = await createQuery(tableName)
      .select('Match.id', 'Match.brokerTopic', pinQuery,
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

  // Procurar partida pelo refreshToken
  // Acesso: público
  async findByRefreshToken(refreshToken) {
    return createQuery(tableName)
      .where('refreshToken', '=', refreshToken)
      .first();
  }

  // Atualizar tokens na partida
  // Acesso: público e coordenador
  async updateTokens(id, { publishToken, refreshToken }) {
    return createQuery(tableName)
      .update({ publishToken, refreshToken })
      .where('id', '=', id);
  }

  // Buscar partida pelo id da academia e da partida
  // Acesso: coordenador
  async findByAcademyIdAndMatchIdAndIngame(academyId, matchId) {
    return createQuery(tableName)
      .where('academyId', '=', academyId)
      .andWhere('id', '=', matchId)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  // Buscar partida em andamento pelo id
  // Acesso: público
  async findByMatchIdAndIngame(matchId, isCoordinator = false) {
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

    if (!isCoordinator && match.pin) {
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

  // Buscar partida em andamento pelo brokerTopic e publishToken
  // Acesso: público (verificação da permissão para publicar no broker)
  async findMatchByBrokerTopicAndPublishTokenAndIngame(brokerTopic, publishToken) {
    return createQuery(tableName)
      .select('id')
      .where('brokerTopic', '=', brokerTopic)
      .andWhere('publishToken', '=', publishToken)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  // Buscar partida pelo brokerTopic
  // Acesso: usuário que está assistindo a partida (pra saber se pode retornar os logs)
  async findMatchByBrokerTopicAndIngame(brokerTopic) {
    return createQuery(tableName)
      .select('id')
      .where('brokerTopic', '=', brokerTopic)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  // Buscar partida pelo publishToken
  // Acesso: jogador que está controlando a partida
  async findMatchByPublishTokenAndIngame(publishToken) {
    return createQuery(tableName)
      .select('id', 'brokerTopic')
      .andWhere('publishToken', '=', publishToken)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  // Buscar partida em andamento pelo id e pin
  // Acesso: público
  async findByMatchIdAndPinAndIngame(matchId, pin) {
    return createQuery(tableName)
      .select('id', 'brokerTopic', 'startedAt', 'duration')
      .where('id', '=', matchId)
      .andWhere('pin', '=', pin)
      .andWhere('status', '=', 'INGAME')
      .first();
  }

  // Buscar partida pelo serialNumber ou pelo brokerTopic
  // Acesso: broker
  async findMatchBySerialNumberOrBrokerTopic(topic) {
    return createQuery(tableName)
      .select('*', 'Match.id as id')
      .leftJoin('Scoreboard', 'Match.scoreboardId', 'Scoreboard.id')
      .andWhere('Match.status', '=', 'INGAME')
      .andWhere((q) => q.where('Scoreboard.serialNumber', '=', topic)
        .orWhere('Match.brokerTopic', '=', topic))
      .first();
  }

  // Atualizar partida
  // Acesso: sistema e coordenador
  async updateMatchById(id, data) {
    return createQuery(tableName)
      .update(data)
      .where('id', '=', id);
  }

  // Buscar partidas em andamento
  // Acesso: sistema
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
