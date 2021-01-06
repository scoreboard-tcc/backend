const ListVirtualMatchesUseCase = require('./ListVirtualMatchesUseCase');

describe('ListVirtualMatchesUseCase', () => {
  test('Retorna partidas virtuais', async () => {
    const mockMatchRepository = {
      findIngameVirtualMatchesByAcademyId: jest.fn(() => [
        {
          id: 1,
          listed: true,
          pin: true,
          brokerTopic: 'abcd',
        },
        {
          id: 2,
          listed: true,
          pin: false,
          brokerTopic: 'abcd',
        },
      ]),
    };

    const useCase = new ListVirtualMatchesUseCase({
      matchRepository: mockMatchRepository,
    });

    const scoreboards = await useCase.execute(1);

    expect(scoreboards).toHaveLength(2);
    expect(scoreboards[0]).toStrictEqual({
      id: 1,
      listed: true,
      pin: true,
      brokerTopic: 'abcd',
    });

    expect(scoreboards[1]).toStrictEqual({
      id: 2,
      listed: true,
      pin: false,
      brokerTopic: 'abcd',
    });

    expect(mockMatchRepository.findIngameVirtualMatchesByAcademyId).toHaveBeenCalledTimes(1);
    expect(mockMatchRepository.findIngameVirtualMatchesByAcademyId).toHaveBeenLastCalledWith(1);
  });
});
