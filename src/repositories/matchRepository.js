const createQuery = require('../providers/database');

const tableName = 'Match';

class MatchRepository {
  async create(match) {
    return createQuery(tableName)
      .insert(match)
      .returning('id');
  }
}

module.exports = MatchRepository;
