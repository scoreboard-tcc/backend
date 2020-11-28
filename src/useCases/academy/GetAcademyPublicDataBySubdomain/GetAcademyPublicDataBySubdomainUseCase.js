const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');

class GetAcademyPublicDataBySubdomainUseCase {
  /**
   * GetAcademyPublicDataBySubdomainUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository }) {
    this.academyRepository = academyRepository;
  }

  async execute(subdomain) {
    const academy = await this.academyRepository.findBySubdomain(subdomain);

    // TODO: retornar partidas em andamento/finalizadas a pouco tempo
    // Tratar:
    // - Partidas não listadas (inclui as com senha)

    if (!academy) {
      throw new NotFoundException('academia', 'subdomínio', subdomain);
    }

    return academy;
  }
}

module.exports = GetAcademyPublicDataBySubdomainUseCase;
