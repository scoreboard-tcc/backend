const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');
const GetAcademyByIdUseCase = require('./GetAcademyByIdUseCase');

describe('GetAcademyByIdUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new GetAcademyByIdUseCase({
      academyRepository: null,
    });

    await expect(useCase.execute())
      .rejects
      .toThrow(ValidationException);
  });

  test('Gera exceção se não encontrar a academia', async () => {
    const mockAcademyRepository = {
      findById: jest.fn(() => undefined),
    };

    const useCase = new GetAcademyByIdUseCase({
      academyRepository: mockAcademyRepository,
    });

    await expect(useCase.execute(1))
      .rejects
      .toThrow(NotFoundException);
  });

  test('Retorna a academia', async () => {
    const mockAcademyRepository = {
      findById: jest.fn(() => ({ id: 1, logoUrl: 'logo' })),
    };

    const useCase = new GetAcademyByIdUseCase({
      academyRepository: mockAcademyRepository,
    });

    const academy = await useCase.execute(1);

    expect(academy).toStrictEqual({ id: 1, logoUrl: 'logo' });
  });
});
