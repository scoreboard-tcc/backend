const createQuery = require('../providers/database');

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
      .select('id', 'listed', 'brokerTopic', 'subscribeToken', createQuery.knexInstance.raw(pin))
      .where('academyId', '=', academyId)
      .whereNull('scoreboardId')
      .andWhere('status', '=', 'INGAME');
  }

  async findListedInGameMatchesByAcademyId(academyId) {
    const pin = '"Match"."pin" is not null as pin';

    return createQuery(tableName)
      .select('Match.id', 'listed', createQuery.knexInstance.raw(pin),
        'Scoreboard.id as scoreboardId', 'Scoreboard.description as scoreboardDescription')
      .leftJoin('Scoreboard', 'Match.scoreboardId', 'Scoreboard.id')
      .where('academyId', '=', academyId)
      .andWhere('status', '=', 'INGAME')
      .andWhere('listed', '=', true);
  }
}

module.exports = MatchRepository;
