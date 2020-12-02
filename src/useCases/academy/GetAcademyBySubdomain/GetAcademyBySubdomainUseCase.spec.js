const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');
const GetAcademyBySubdomainUseCase = require('./GetAcademyBySubdomainUseCase');

describe('GetAcademyBySubdomainUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new GetAcademyBySubdomainUseCase({
      academyRepository: null,
    });

    try {
      await useCase.execute();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
    }
  });

  test('Gera exceção se não encontrar a academia', async () => {
    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => undefined),
    };

    const useCase = new GetAcademyBySubdomainUseCase({
      academyRepository: mockAcademyRepository,
    });

    try {
      await useCase.execute('club');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockAcademyRepository.findBySubdomain.mock.calls.length).toBe(1);
      expect(mockAcademyRepository.findBySubdomain.mock.calls[0][0]).toBe('club');
    }
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
