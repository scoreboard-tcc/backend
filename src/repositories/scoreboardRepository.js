const createQuery = require('../providers/database');

const tableName = 'Scoreboard';

class ScoreboardRepository {
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
      .insert(scoreboard);
  }
}

module.exports = ScoreboardRepository;
