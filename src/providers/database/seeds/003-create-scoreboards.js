exports.seed = (knex) => knex('Scoreboard').del()
  .then(() => knex('Scoreboard').insert([
    {
      id: 1,
      serialNumber: 'mt_001',
      academyId: 1,
      description: 'Placar quadra 1',
      staticToken: '1',
    },
    {
      id: 2,
      serialNumber: 'mt_002',
      academyId: 1,
      description: 'Placar quadra 2',
      staticToken: '1',
    }, {
      id: 3,
      serialNumber: 'mt_003',
      academyId: 1,
      description: 'Placar quadra 3',
      staticToken: '1',
    },
  ]));
