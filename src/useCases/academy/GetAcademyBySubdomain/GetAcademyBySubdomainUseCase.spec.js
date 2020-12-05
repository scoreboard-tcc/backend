const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');
const GetAcademyBySubdomainUseCase = require('./GetAcademyBySubdomainUseCase');

describe('GetAcademyBySubdomainUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new GetAcademyBySubdomainUseCase({
      academyRepository: null,
    });

    await expect(useCase.execute())
      .rejects
      .toThrow(ValidationException);
  });

  test('Gera exceção se não encontrar a academia', async () => {
    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => undefined),
    };

    const useCase = new GetAcademyBySubdomainUseCase({
      academyRepository: mockAcademyRepository,
    });

    await expect(useCase.execute('club'))
      .rejects
      .toThrow(NotFoundException);

    expect(mockAcademyRepository.findBySubdomain.mock.calls.length).toBe(1);
    expect(mockAcademyRepository.findBySubdomain.mock.calls[0][0]).toBe('club');
  });

  test('Retorna a academia', async () => {
    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => ({ id: 1 })),
    };

    const useCase = new GetAcademyBySubdomainUseCase({
      academyRepository: mockAcademyRepository,
    });

    const academy = await useCase.execute('club');

    expect(academy).toStrictEqual({ id: 1 });
    expect(mockAcademyRepository.findBySubdomain.mock.calls.length).toBe(1);
    expect(mockAcademyRepository.findBySubdomain.mock.calls[0][0]).toBe('club');
  });
});
