const { MatchLog, MessageLog, ScoreLog } = require('../providers/mongo/schema');

class ScoreRepository {
  async createMatchLog(data) {
    return await MatchLog.create(data);
  }

  async createScoreLog(data) {
    return await ScoreLog.create(data);
  }

  async createMessageLog(data) {
    return await MessageLog.create(data);
  }

  async incrementAndGetControllerSequence(matchId) {
    const { controllerSequence } = await MatchLog.findOneAndUpdate({
      matchId,
    }, {
      $inc: {
        controllerSequence: 1,
      },
    }, {
      new: true,
      useFindAndModify: true,
    });

    return controllerSequence;
  }

  async findMatchLogByMatchId(matchId) {
    return await MatchLog
      .findOne({ matchId });
  }

  async findScoreLog(where) {
    return await ScoreLog
      .findOne(where);
  }

  async removeOrphanScores(matchId, scoreSequence) {
    return await ScoreLog.deleteMany({
      matchId,
      sequence: {
        $gt: scoreSequence,
      },
    });
  }

  async updateMatchLog(where, update) {
    return await MatchLog.updateOne(where, update);
  }

  async updateScoreLog(where, update) {
    return await ScoreLog.updateOne(where, update);
  }

  async getLogsByMatchId(matchId, { page, limit }) {
    return MessageLog.paginate({ matchId }, {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
    });
  }
}

module.exports = ScoreRepository;
