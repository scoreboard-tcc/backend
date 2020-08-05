const GetAcademiesUseCase = require('./GetAcademiesUseCase');

describe('GetAcademiesUseCase', () => {
  test('It returns academies', async () => {
    const mockAcademyRepository = {
      findAll: jest.fn(() => [{ id: 1 }]),
    };

    const getAcademiesUseCase = new GetAcademiesUseCase(mockAcademyRepository);
    const academies = await getAcademiesUseCase.execute();

    expect(academies).toStrictEqual([{ id: 1 }]);
    expect(mockAcademyRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
