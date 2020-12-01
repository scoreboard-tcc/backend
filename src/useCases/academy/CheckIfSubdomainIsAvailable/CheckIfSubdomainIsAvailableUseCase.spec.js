const ValidationException = require('../../../exceptions/ValidationException');
const CheckIfSubdomainIsAvailableUseCase = require('./CheckIfSubdomainIsAvailableUseCase');

describe('CheckIfSubdomainIsAvailableUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', () => {
    const useCase = new CheckIfSubdomainIsAvailableUseCase({
      academyRepository: null,
    });

    try {
      useCase.execute('');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
    }
  });

  test('Retorna "true" se o subdomínio estiver disponível', async () => {
    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => undefined),
    };

    const useCase = new CheckIfSubdomainIsAvailableUseCase({
      academyRepository: mockAcademyRepository,
    });

    expect(await useCase.execute('club')).toBeTruthy();
  });

  test('Retorna "false" se o subdomínio não estiver disponível', async () => {
    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => ({})),
    };

    const useCase = new CheckIfSubdomainIsAvailableUseCase({
      academyRepository: mockAcademyRepository,
    });

    expect(await useCase.execute('club')).toBeFalsy();
  });
});
