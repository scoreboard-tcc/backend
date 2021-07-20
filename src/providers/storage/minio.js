const Minio = require('minio');
const config = require('../../config/minio');

module.exports = new Minio.Client({
  endPoint: config.endPoint,
  port: config.port,
  useSSL: false,
  accessKey: config.accessKey,
  secretKey: config.secretKey,
});
