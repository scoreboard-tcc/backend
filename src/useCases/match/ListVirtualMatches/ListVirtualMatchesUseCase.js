const MatchRepository = require('../../../repositories/matchRepository');

class ListVirtualMatchesUseCase {
  /**
   * ListVirtualMatchesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository }) {
    this.matchRepository = matchRepository;
  }

  async execute(academyId) {
    /*
    - será necessário um mecanismo para avisar aos interessados que o controle do placar mudou

  - quando cria a partida, inicializa tópico controlSequence em 0
  - retorna para o coordenadro o controlSequence
  - o coordenador armazena o controlSequence

  - quando lista as partidas, compara o valor do tópico controlSequence com o controlSequence armazenado para saber se está controlando o placar

  - quando trocar o controle da partida, publicar controlSequence incrementado e retornar para o usuário o novo controlSequence
  - o usuário armazena o novo controlSequence
  - os demais usuários serão atualizados e não terão mais o controle

*/

    return this.matchRepository.findIngameVirtualMatchesByAcademyId(academyId);
  }
}

module.exports = ListVirtualMatchesUseCase;
