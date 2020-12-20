const ListVirtualMatchesUseCase = require('./ListVirtualMatchesUseCase');
const crypto = require('crypto');

describe('ListVirtualMatchesUseCase', () => {
  test('Retorna partidas virtuais', async () => {
    const mockMatchRepository = {
      findIngameVirtualMatchesByAcademyId: jest.fn(() => [
        {
          id: 1,
          listed: true,
          pin: true,
          publishToken: 'secret',
        },
        {
          id: 2,
          listed: true,
          pin: true,
          publishToken: 'secret2',
        },
      ]),
    };

    const useCase = new ListVirtualMatchesUseCase({
      matchRepository: mockMatchRepository,
    });

    const publishTokenHashes = [
      crypto.createHash('sha1').update('secret').digest('hex'),
      crypto.createHash('sha1').update('secrets2').digest('hex'),
    ];

    const scoreboards = await useCase.execute(1, publishTokenHashes);

    expect(scoreboards).toHaveLength(2);
    expect(scoreboards[0]).toStrictEqual({
      id: 1,
      listed: true,
      pin: true,
      controlledByCurrentUser: true,
    });

    expect(scoreboards[1]).toStrictEqual({
      id: 2,
      listed: true,
      pin: true,
      controlledByCurrentUser: false,
    });
  });
});
