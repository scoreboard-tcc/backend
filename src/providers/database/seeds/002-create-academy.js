exports.seed = (knex) => knex('Academy').del()
  .then(() => knex('Academy').insert([
    {
      id: 5,
      subdomain: 'mouraotennis',
      name: 'Mourão Tennis',
      address: 'Rua 123',
      logoUrl: 'logos/a36be42f-cd8e-4a5b-af28-77426a67b9f0.png',
    },
  ]));
