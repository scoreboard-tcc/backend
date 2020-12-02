const GetDashboardUseCase = require('./GetDashboardUseCase');

describe('GetDashboardUseCase', () => {
  test('Retorna dados da dashboard', async () => {
    const mockAcademyRepository = {
      count: jest.fn(() => ({ count: 5 })),
    };

    const mockScoreboardRepository = {
      count: jest.fn(() => ({ count: 3 })),
    };

    const useCase = new GetDashboardUseCase({
      academyRepository: mockAcademyRepository,
      scoreboardRepository: mockScoreboardRepository,
    });

    const dashboard = await useCase.execute();

    expect(dashboard).toStrictEqual({
      academyCount: 5,
      scoreboardCount: 3,
    });
  });
});
