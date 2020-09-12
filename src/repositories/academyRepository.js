const knex = require('../providers/database');

const tableName = 'Academy';

class AcademyRepository {
  async findByName(name, pagination) {
    return knex(tableName)
      .where('name', 'ilike', `%${name}%`)
      .paginate(pagination);
  }

  async findBySubdomain(subdomain) {
    return knex(tableName)
      .where('subdomain', 'like', subdomain)
      .first();
  }

  async create(academy) {
    return knex(tableName)
      .insert(academy);
  }
}

module.exports = AcademyRepository;
