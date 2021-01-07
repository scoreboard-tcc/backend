const aedes = require('aedes');
const aedesPersistenceMongoDB = require('aedes-persistence-mongodb');
const ws = require('websocket-stream');
const brokerConfig = require('../../config/broker');
const buildAuthorizePublish = require('./authorizePublish');
const authorizeSubscribe = require('./authorizeSubscribe');
const http = require('http');
const net = require('net');

const broker = aedes({
  persistence: aedesPersistenceMongoDB(
    {
      url: brokerConfig.persistenceUrl,
    },
  ),
});

broker.authorizeSubscribe = authorizeSubscribe;
broker.authorizePublish = buildAuthorizePublish(broker);

const httpServer = http.createServer();

ws.createServer({
  server: httpServer,
}, broker.handle);

const server = net.createServer(broker.handle);

/**
 *
 */
async function listen() {
  httpServer.listen(brokerConfig.wsPort, () => {
    console.log('Aedes server (WebSocket) running');
  });

  server.listen(brokerConfig.standalonePort, () => {
    console.log('Aedes server (Standalone) running');
  });
}

module.exports = { broker, listen };
