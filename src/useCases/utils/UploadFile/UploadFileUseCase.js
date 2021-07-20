const { v4: uuid } = require('uuid');
const minio = require('../../../providers/storage/minio');
const config = require('../../../config/minio')

class UploadFileUseCase {
  async execute(file) {
    const extension = file.originalname.split('.').pop()
    const fileName = `${uuid()}.${extension}`;

    minio.putObject('logos', fileName, file.buffer);

    return `${config.domain}/logos/${fileName}`;
  }
}

module.exports = UploadFileUseCase;
