const { addMinutes } = require('date-fns');
const { v4: uuid } = require('uuid');
const BusinessException = require('../../../exceptions/BusinessException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const { broker } = require('../../../providers/mqtt');
const EnrollmentRepository = require('../../../repositories/enrollmentRepository');
const MatchRepository = require('../../../repositories/matchRepository');
const PlayerRepository = require('../../../repositories/playerRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const { isEmpty } = require('../../../utils/string');

const validateSchema = require('../../../utils/validation');
const GetAcademyByIdUseCase = require('../../academy/GetAcademyById/GetAcademyByIdUseCase');
const CreateMatchValidator = require('./CreateMatchValidator');

class CreateMatchUseCase {
  /**
   * CreateMatchUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   * @param {EnrollmentRepository} container.enrollmentRepository - EnrollmentRepository
   * @param {MatchRepository} container.matchRepository - MatchRepository
   * @param {PlayerRepository} container.playerRepository - PlayerRepository
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   */
  constructor({
    getAcademyByIdUseCase, scoreboardRepository, enrollmentRepository, matchRepository, playerRepository,
  }) {
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.scoreboardRepository = scoreboardRepository;
    this.enrollmentRepository = enrollmentRepository;
    this.matchRepository = matchRepository;
    this.playerRepository = playerRepository;
  }

  validate(request) {
    validateSchema(CreateMatchValidator, request);
  }

  async execute(academyId, request) {
    this.validate(request);

    await this.getAcademyByIdUseCase.execute(academyId);

    let scoreboard = null;

    if (request.scoreboardId) {
      scoreboard = await this.checkIfScoreboardIsAvailable(request.scoreboardId, academyId);
    }

    if (request.player1Id) {
      await this.checkIfPlayerExists(request.player1Id, academyId);
    }

    if (request.player2Id) {
      await this.checkIfPlayerExists(request.player2Id, academyId);
    }

    if (request.player1Id && request.player2Id) {
      this.checkIfPlayersAreNotTheSame(request.player1Id, request.player2Id);
    }

    return this.createMatch(academyId, request, scoreboard);
  }

  async checkIfScoreboardIsAvailable(scoreboardId, academyId) {
    const scoreboard = await this.scoreboardRepository.findByIdAndAcademyIdAndActive(scoreboardId, academyId);

    if (!scoreboard) throw new NotFoundException('Placar', 'id', scoreboardId);

    const isAvailable = await this.scoreboardRepository.checkIfIsAvailable(scoreboardId, academyId);

    if (!isAvailable) throw new BusinessException('O placar não está disponível.');

    return scoreboard;
  }

  async checkIfPlayerExists(playerId, academyId) {
    const enrollment = await this.enrollmentRepository.findByAcademyIdAndPlayerId(academyId, playerId);

    if (!enrollment) throw new BusinessException('Um ou mais jogadores não estão matriculados na academia');
  }

  checkIfPlayersAreNotTheSame(player1Id, player2Id) {
    if (player1Id === player2Id) {
      throw new BusinessException('O jogador 1 deve ser diferente do jogador 2.');
    }
  }

  getBrokerTopic(scoreboard) {
    return scoreboard && scoreboard.serialNumber ? scoreboard.serialNumber : uuid();
  }

  async getPlayerName(playerId, playerName, academyId) {
    if (!playerId) {
      return playerName;
    }

    const player = await this.playerRepository.findByIdAndAcademyId(playerId, academyId);

    if (!player) {
      throw new NotFoundException('Jogador', 'id', playerId);
    }

    return player.name;
  }

  async createMatch(academyId, request, scoreboard) {
    const publishToken = uuid();
    const refreshToken = uuid();
    const subscribeToken = !isEmpty(request.pin) ? uuid() : null;

    const match = {
      academyId,
      scoreboardId: request.scoreboardId,
      duration: request.duration,
      player1Id: request.player1Id,
      player2Id: request.player2Id,
      player1Name: await this.getPlayerName(request.player1Id, request.player1Name, academyId),
      player2Name: await this.getPlayerName(request.player2Id, request.player2Name, academyId),
      listed: request.listed,
      pin: isEmpty(request.pin) ? null : request.pin,
      publishToken,
      refreshToken,
      subscribeToken,
      brokerTopic: this.getBrokerTopic(scoreboard),
      tieBreakType: request.tieBreakType,
      scoringType: request.scoringType,
      hasAdvantage: request.hasAdvantage,
    };

    const { id } = await this.matchRepository.create(match);

    const tokenExpiration = addMinutes(new Date(), request.duration);

    this.publishInitialData(match.brokerTopic);

    return {
      id,
      publishToken,
      refreshToken,
      subscribeToken,
      expiration: tokenExpiration,
    };
  }

  async publishInitialData(brokerTopic) {
    const topics = [
      'Set1_A',
      'Set1_B',
      'Set2_A',
      'Set2_B',
      'Set3_A',
      'Set3_B',
      'Score_A',
      'Score_B',
      'Current_Set',
      'SetsWon_A',
      'SetsWon_B'];

    topics.forEach((topic) => broker.publish({
      topic: `${brokerTopic}/${topic}`,
      payload: Buffer.from('0'),
      qos: 1,
      retain: true,
    }));

    broker.publish({
      topic: `${brokerTopic}/Player_Serving`,
      payload: Buffer.from('A'),
      qos: 1,
      retain: true,
    });
  }
}

module.exports = CreateMatchUseCase;
