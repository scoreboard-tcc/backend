const { addMinutes } = require('date-fns');
const { v4: uuid } = require('uuid');
const BusinessException = require('../../../exceptions/BusinessException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const EnrollmentRepository = require('../../../repositories/enrollmentRepository');
const MatchRepository = require('../../../repositories/matchRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');

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
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   */
  constructor({
    getAcademyByIdUseCase, scoreboardRepository, enrollmentRepository, matchRepository,
  }) {
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.scoreboardRepository = scoreboardRepository;
    this.enrollmentRepository = enrollmentRepository;
    this.matchRepository = matchRepository;
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

  async createMatch(academyId, request, scoreboard) {
    const publishToken = uuid();
    const refreshToken = uuid();
    const subscribeToken = request.pin ? uuid() : null;

    const match = {
      academyId,
      scoreboardId: request.scoreboardId,
      duration: request.duration,
      player1Id: request.player1Id,
      player2Id: request.player2Id,
      player1Name: request.player1Id ? '' : request.player1Name,
      player2Name: request.player2Id ? '' : request.player2Name,
      listed: request.listed,
      pin: request.pin,
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

    return {
      id,
      publishToken,
      refreshToken,
      subscribeToken,
      expiration: tokenExpiration,
    };
  }
}

module.exports = CreateMatchUseCase;
