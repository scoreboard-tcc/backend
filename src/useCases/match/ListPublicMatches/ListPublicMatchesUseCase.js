const MatchRepository = require('../../../repositories/matchRepository');

class ListPublicMatchesUseCase {
  /**
   * ListPublicMatchesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param  {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository }) {
    this.matchRepository = matchRepository;
  }

  async execute(academyId) {
    return this.matchRepository.findListedInGameMatchesByAcademyId(academyId);

    // verificar nos outros useCases ->
    // retorna tópico da partida (se for placar físico, pegar do placar ao criar a partida)

    // acessado publicamete
    // - usuário lista as partidas (não retornar subscribeToken, nem o brokerTopic se tiver o pin)
    // - nas partidas sem tópico, verificar se tem armazenado localmente e atribui o tópic
    // - se inscreve nos placares que tiverem o tópico (os sem pin)
    // - utiliza o tópico controlSequence para saber se tem o controle do placar
    // - os placares com senha terão um cadeado
    // - ao clicar no placar com senha, mostra input para digitar o pin
    // - requisita rota para checar se o pin está certo
    // - se estiver certo, rota retorna o subscribeToken e o tópico da partida
    // - armazena id da partida, tópico, subscribeToken e data final da partida localmente
    // - abre tela de detalhes do placar
  }
}

module.exports = ListPublicMatchesUseCase;
