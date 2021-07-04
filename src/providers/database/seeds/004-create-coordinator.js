const bcryptjs = require('bcryptjs');

exports.seed = (knex) => knex('Coordinator').del()
  .then(() => knex('Coordinator').insert([
    {
      id: 1,
      academyId: 5,
      email: 'joao@gmail.com',
      name: 'João da Mourão Tennis',
      password: bcryptjs.hashSync('123456', 10),
    },
  ]));
