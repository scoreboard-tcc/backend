const config = require('./src/config/postgres');

module.exports = {
  development: {
    client: 'postgresql',
    connection: config.connectionUrl,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/providers/database/migrations',
    },
    seeds: {
      directory: 'src/providers/database/seeds',
    },
  },
};
