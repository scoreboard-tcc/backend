const aedes = require('aedes');
const aedesPersistenceMongoDB = require('aedes-persistence-mongodb');
const brokerConfig = require('../../config/broker');

const broker = aedes({
  persistence: aedesPersistenceMongoDB(
    {
      url: brokerConfig.persistenceUrl,
    },
  ),
});

module.exports = broker;
