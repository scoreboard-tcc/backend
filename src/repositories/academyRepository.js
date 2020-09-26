const createQuery = require('../providers/database');

const tableName = 'Academy';

class AcademyRepository {
  async findById(id) {
    return createQuery(tableName)
      .where('id', '=', id)
      .first();
  }

  async findByName(name, pagination) {
    return createQuery(tableName)
      .where('name', 'ilike', `%${name}%`)
      .paginate(pagination);
  }

  async findBySubdomain(subdomain) {
    return createQuery(tableName)
      .where('subdomain', 'like', subdomain)
      .first();
  }

  async create(academy) {
    return createQuery(tableName)
      .insert(academy)
      .returning('id');
  }

  async update(id, academy) {
    return createQuery(tableName)
      .update(academy)
      .where('id', '=', id);
  }
}

module.exports = AcademyRepository;
