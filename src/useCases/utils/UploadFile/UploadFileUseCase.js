const { v4: uuid } = require('uuid');
const firebase = require('../../../providers/firebase');

class UploadFileUseCase {
  async execute(file) {
    const bucket = firebase.storage().bucket();
    const path = `logos/${uuid()}.${file.originalname.split('.').pop()}`;

    const createdFile = bucket.file(path);

    await createdFile.save(file.buffer, {
      resumable: false,
      gzip: true,
      contentType: file.mimetype,
    });

    await createdFile.makePublic();

    return path;
  }
}

module.exports = UploadFileUseCase;
