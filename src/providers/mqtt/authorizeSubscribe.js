/**
 * @param client
 * @param subscription
 * @param callback
 */
async function authorizeSubscribe(client, subscription, callback) {
  try {
    const isTopicValid = subscription.topic.match(/^([a-zA-Z0-9\-:]+)\/([a-zA-Z0-9#_]+)$/);

    if (!isTopicValid) {
      return callback(new Error('Tópico inválido'));
    }

    return callback(null, subscription);
  } catch (error) {
    return callback(new Error('Erro ao se inscrever'));
  }
}

module.exports = authorizeSubscribe;
