const knex = require('../providers/database');

class AcademyRepository {
  async findAll(pagination) {
    return knex('Academy')
      .paginate(pagination);
  }
}

module.exports = AcademyRepository;
