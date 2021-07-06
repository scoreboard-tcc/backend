exports.seed = (knex) => knex('Player').del()
  .then(() => knex('Player').insert([
    {
      id: 1,
      email: 'jose@gmail.com',
      name: 'José',
    },
    {
      id: 2,
      email: 'ana@gmail.com',
      name: 'Ana',
    },
    {
      id: 3,
      email: 'maria@gmail.com',
      name: 'Maria',
    },
    {
      id: 4,
      email: 'joao@gmail.com',
      name: 'João',
    },
  ]));
