const createQuery = require('../providers/database');

const tableName = 'Scoreboard';

class ScoreboardRepository {
  async findByIdAndActive(id) {
    return createQuery(tableName)
      .where('id', '=', id)
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
}

module.exports = ScoreboardRepository;
