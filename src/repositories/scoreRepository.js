const { MatchLog, MessageLog, ScoreLog } = require('../providers/mongo/schema');

class ScoreRepository {
  async createMatchLog(data) {
    return MatchLog.create(data);
  }

  async createScoreLog(data) {
    return ScoreLog.create(data);
  }

  async createMessageLog(data) {
    return MessageLog.create(data);
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
}

module.exports = ScoreRepository;
