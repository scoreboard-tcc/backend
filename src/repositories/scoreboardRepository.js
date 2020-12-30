const createQuery = require('../providers/database');
const { knexInstance } = require('../providers/database');

const tableName = 'Scoreboard';

class ScoreboardRepository {
  async findByIdAndActive(id) {
    return createQuery(tableName)
      .where('id', '=', id)
      .andWhere('active', '=', true)
      .first();
  }

  async findByIdAndAcademyIdAndActive(id, academyId) {
    return createQuery(tableName)
      .where('id', '=', id)
      .andWhere('academyId', '=', academyId)
      .andWhere('active', '=', true)
      .first();
  }

  async findBySerialNumberAndActive(serialNumber) {
    return createQuery(tableName)
      .where('serialNumber', 'like', serialNumber)
      .andWhere('active', '=', true)
      .first();
  }

  async findByAcademyAndDescription(academyId, description, pagination) {
    return createQuery(tableName)
      .where('description', 'ilike', `%${description}%`)
      .andWhere('academyId', '=', academyId)
      .andWhere('active', '=', true)
      .paginate(pagination);
  }

  async create(scoreboard) {
    return createQuery(tableName)
      .insert(scoreboard)
      .returning('id');
  }

  async delete(id) {
    return createQuery(tableName)
      .update({ active: false })
      .where('id', '=', id);
  }

  async update(id, scoreboard) {
    return createQuery(tableName)
      .update(scoreboard)
      .where('id', '=', id);
  }

  async count() {
    return createQuery(tableName)
      .where('active', '=', true)
      .count()
      .first();
  }

  async checkIfIsAvailable(scorebardId, academyId) {
    const res = await knexInstance.first(
      knexInstance.raw(
        'exists ? as present',
        createQuery('Match')
          .where('scoreboardId', '=', scorebardId)
          .andWhere('academyId', '=', academyId)
          .andWhere('status', '=', 'INGAME'),
      ),
    );

    return res.present === false;
  }

  async findByAcademyIdWithMatches(academyId) {
    const pin = '"Match"."pin" is not null as pin';

    const data = await createQuery(tableName)
      .select('Scoreboard.id', 'Scoreboard.description', 'Match.id as matchId', 'Match.listed', 'Match.brokerTopic', 'Match.subscribeToken', 'Match.player1Name', 'Match.player2Name', knexInstance.raw(pin))
      .leftJoin('Match', function join() {
        this.on('Scoreboard.id', '=', 'Match.scoreboardId')
          .andOnVal('Match.status', 'INGAME');
      })
      .where('Scoreboard.academyId', '=', academyId)
      .andWhere('Scoreboard.active', '=', true);

    return data.map((result) => ({
      id: result.id,
      description: result.description,
      match: result.matchId ? {
        id: result.matchId,
        listed: result.listed,
        pin: result.pin,
        brokerTopic: result.brokerTopic,
        subscribeToken: result.subscribeToken,
        player1Name: result.player1Name,
        player2Name: result.player2Name,
      } : null,
    }));
  }
}

module.exports = ScoreboardRepository;
