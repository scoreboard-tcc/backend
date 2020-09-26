const createQuery = require('../providers/database');

const tableName = 'Coordinator';

class CoordinatorRepository {
  async findById(id) {
    return createQuery(tableName)
      .where('id', '=', id)
      .first();
  }

  async findByEmail(email) {
    return createQuery(tableName)
      .where('email', '=', email)
      .first();
  }

  async create(coordinator) {
    return createQuery(tableName)
      .insert(coordinator)
      .returning('id');
  }
}

module.exports = CoordinatorRepository;
