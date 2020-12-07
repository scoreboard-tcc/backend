const createQuery = require('../providers/database');

const tableName = 'Enrollment';

class EnrollmentRepository {
  async findByAcademyIdAndPlayerId(academyId, playerId) {
    return createQuery(tableName)
      .where('academyId', '=', academyId)
      .andWhere('playerId', '=', playerId)
      .first();
  }

  async create(academyId, playerId) {
    return createQuery(tableName)
      .insert({
        academyId,
        playerId,
      });
  }

  async delete(academyId, playerId) {
    return createQuery(tableName)
      .del()
      .where('academyId', '=', academyId)
      .andWhere('playerId', '=', playerId);
  }
}

module.exports = EnrollmentRepository;
