const createQuery = require('../database');

/**
 * @param brokerTopic
 * @param publishToken
 */
async function checkPublishToken(brokerTopic, publishToken) {
  return createQuery('Match')
    .select('Match.id')
    .leftJoin('Scoreboard', 'Match.scoreboardId', 'Scoreboard.id')
    .where('brokerTopic', '=', brokerTopic)
    .andWhere((q) => q.where('publishToken', '=', publishToken)
      .orWhere('staticToken', '=', publishToken))
    .andWhere('status', '=', 'INGAME')
    .first();
}

/**
 * @param client
 * @param packet
 * @param callback
 */
async function authorizePublish(client, packet, callback) {
  try {
    const [scoreboardTopic, field] = packet.topic.split('/');

    if (!scoreboardTopic || !field) {
      return callback(new Error('unauthorized'));
    }

    if (field === 'Publisher') {
      return callback(new Error('unauthorized'));
    }

    const data = JSON.parse(packet.payload.toString());

    if (!data || !data.publishToken) {
      return callback(new Error('unauthorized'));
    }

    if (!await checkPublishToken(scoreboardTopic, data.publishToken)) {
      return callback(new Error('unauthorized'));
    }

    // eslint-disable-next-line no-param-reassign
    packet.payload = Buffer.from(data.payload);

    return callback(null);

    // TODO: verificar o ScoreConfirmation
  } catch (error) {
    console.log('[DEBUG] authorizePublish error', error);
    return callback(new Error('unauthorized'));
  }
}

module.exports = authorizePublish;
