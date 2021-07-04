const bcryptjs = require('bcryptjs');

exports.seed = (knex) => knex('Admin').del()
  .then(() => knex('Admin').insert([
    {
      id: 1, email: 'admin@admin.com', name: 'Administrador do sistema', password: bcryptjs.hashSync('123456', 10),
    },
  ]));
