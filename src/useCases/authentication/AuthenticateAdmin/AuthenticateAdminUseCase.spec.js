const jwt = require('jsonwebtoken');

const config = require('../../../config/secrets');
const BusinessException = require('../../../exceptions/BusinessException');
const ValidationException = require('../../../exceptions/ValidationException');
const AuthenticateAdminUseCase = require('./AuthenticateAdminUseCase');

const email = 'john@doe.com';
const password = '123456';

describe('AuthenticateAdminUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new AuthenticateAdminUseCase({
      adminRepository: null,
    });

    await expect(useCase.execute())
      .rejects
      .toThrow(ValidationException);
  });

  test('Gera exceção se credenciais forem inválidas', async () => {
    const mockAdminRepository = {
      findByEmailAndPassword: jest.fn(() => {
        throw new BusinessException();
      }),
    };

    const useCase = new AuthenticateAdminUseCase({
      adminRepository: mockAdminRepository,
    });

    await expect(useCase.execute({
      email,
      password,
    }))
      .rejects
      .toThrow(BusinessException);

    expect(mockAdminRepository.findByEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(mockAdminRepository.findByEmailAndPassword).toHaveBeenCalledWith(email, password);
  });

  test('Retorna token se credenciais forem válidas', async () => {
    const mockAdminRepository = {
      findByEmailAndPassword: jest.fn(() => {}),
    };

    const useCase = new AuthenticateAdminUseCase({
      adminRepository: mockAdminRepository,
    });

    jest.mock('../../../config/secrets');

    config.jwtSecret = 'secret';

    const token = await useCase.execute({
      email,
      password,
    });

    const decoded = jwt.decode(token);

    expect(decoded.email).toBe(email);
    expect(decoded.type).toBe('administrator');
  });
});
