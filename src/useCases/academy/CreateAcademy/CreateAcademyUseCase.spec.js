const ValidationException = require('../../../exceptions/ValidationException');
const CreateAcademyUseCase = require('./CreateAcademyUseCase');

function academyFactory() {
    
}

describe('CreateAcademyUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const createAcademyUseCase = new CreateAcademyUseCase({
      academyRepository: null,
      createScoreboardUseCase: null,
      createCoordinatorUseCase: null,
    });

    try {
      createAcademyUseCase.execute({});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
    }
  });

  test('Gera exceção se o subdomínio já está sendo utilizado', () => {
    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => null),
    };

    const createAcademyUseCase = new CreateAcademyUseCase({
      academyRepository: mockAcademyRepository,
      createScoreboardUseCase: null,
      createCoordinatorUseCase: null,
    });

    try {
        createAcademyUseCase.execute({});
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
      }
  });
});
