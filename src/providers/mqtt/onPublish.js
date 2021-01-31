/* eslint-disable camelcase */
const container = require('../../container');

const broker = container.resolve('broker');
const addScoreUseCase = container.resolve('addScoreUseCase');
const matchRepository = container.resolve('matchRepository');
const finishMatchUseCase = container.resolve('finishMatchUseCase');

/**
 * @param topic
 * @param fieldMap
 */
async function publishScoreTopics(topic, fieldMap) {
  Object.entries(fieldMap)
    .filter(([t]) => !['Player_Scored', 'Score_Type', 'Score'].includes(t))
    .forEach(([field, value]) => broker.publish({
      topic: `${topic}/${field}`,
      payload: Buffer.from(value),
      qos: 1,
      retain: true,
    }));
}

/**
 * @param match
 * @param topic
 * @param packet
 */
async function processScorePacket(match, topic, packet) {
  try {
    const data = packet.payload.toString();

    const [
      Set1_A,
      Set1_B,
      Set2_A,
      Set2_B,
      Set3_A,
      Set3_B,
      Score_A,
      Score_B,
      Current_Set,
      SetsWon_A,
      SetsWon_B,
      Player_Serving,
      Match_Winner,
      Current_State,
      Player_Scored,
      Score_Type,
    ] = data.split(';');

    const fieldMap = {
      Set1_A,
      Set1_B,
      Set2_A,
      Set2_B,
      Set3_A,
      Set3_B,
      Score_A,
      Score_B,
      Current_Set,
      SetsWon_A,
      SetsWon_B,
      Player_Serving,
      Match_Winner,
      Current_State,
      Player_Scored,
      Score_Type,
    };

    publishScoreTopics(topic, fieldMap);
    addScoreUseCase.execute(match, fieldMap);

    if (Match_Winner !== 'null') {
      setTimeout(() => {
        finishMatchUseCase.execute(match);
      }, 5000);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param packet
 */
function shouldIgnorePacket(packet) {
  return packet && packet.properties
  && packet.properties.userProperties
  && packet.properties.userProperties.ignorePacket;
}

/**
 * @param scoreboardAndMatchTopics
 * @param topic
 * @param field
 * @param packet
 */
async function forwardPacket(scoreboardAndMatchTopics, topic, field, packet) {
  const topicToForward = scoreboardAndMatchTopics.brokerTopic === topic
    ? scoreboardAndMatchTopics.serialNumber : scoreboardAndMatchTopics.brokerTopic;

  broker.publish({
    topic: `${topicToForward}/${field}`,
    payload: packet.payload,
    qos: 1,
    retain: true,
    properties: {
      userProperties: {
        ignorePacket: true,
      },
    },
  });
}

/**
 * @param packet
 */
async function onPublish(packet) {
  const [topic, field] = packet.topic.split('/');

  if (topic === '$SYS' || shouldIgnorePacket(packet)) {
    return;
  }

  const match = await matchRepository.findMatchBySerialNumberOrBrokerTopic(topic);

  if (!match) {
    return;
  }

  if (match.scoreboardId) {
    forwardPacket(match, topic, field, packet);
  }

  if (field === 'Score') {
    processScorePacket(match, topic, packet);
  }
}

module.exports = onPublish;
