const MatchRepository = require('../../repositories/matchRepository');
const ScoreboardRepository = require('../../repositories/scoreboardRepository');

const scoreboardRepository = new ScoreboardRepository();
const matchRepository = new MatchRepository();

/**
 * @param topic
 * @param token
 */
async function checkPermissionToPublish(topic, token) {
  const scoreboard = await scoreboardRepository.findBySerialNumberAndStaticTokenAndActive(topic, token);

  if (scoreboard) {
    return;
  }

  const match = await matchRepository.findMatchByBrokerTopicAndPublishTokenAndIngame(topic, token);

  if (!match) {
    throw new Error('Partida não encontrada');
  }
}

/**
 * @param client
 * @param packet
 * @param callback
 */
async function authorizePublish(client, packet, callback) {
  try {
    const [topic, field] = packet.topic.split('/');

    if (!topic || !field) {
      return callback(new Error('Erro'));
    }

    if (field === 'Controller_Sequence') {
      return callback(new Error('Erro'));
    }

    const data = JSON.parse(packet.payload.toString());

    if (!data || !data.publishToken) {
      return callback(new Error('Erro'));
    }

    await checkPermissionToPublish(topic, data.publishToken);

    // eslint-disable-next-line no-param-reassign
    packet.payload = Buffer.from(data.payload);

    return callback(null);

    // TODO: verificar o ScoreConfirmation
  } catch (error) {
    console.log(error);
    return callback(new Error('Error'));
  }
}

module.exports = authorizePublish;
