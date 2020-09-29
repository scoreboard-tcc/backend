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

  async findByAcademyAndName(academyId, name, pagination) {
    return createQuery(tableName)
      .where('name', 'ilike', `%${name}%`)
      .andWhere('academyId', '=', academyId)
      .paginate(pagination);
  }

  async create(coordinator) {
    return createQuery(tableName)
      .insert(coordinator)
      .returning('id');
  }

  async delete(id) {
    return createQuery(tableName)
      .del()
      .where('id', '=', id);
  }

  async update(id, coordinator) {
    return createQuery(tableName)
      .update(coordinator)
      .where('id', '=', id);
  }
}

module.exports = CoordinatorRepository;
