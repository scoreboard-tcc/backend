const { v4: uuid } = require('uuid');
const minio = require('../../../providers/storage/minio');
const config = require('../../../config/minio')

async function createBucketIfNotExists() {
  const exists = (await minio.listBuckets()).find(b => b.name === 'logos')

  if (!exists) {
    await minio.makeBucket('logos')
    await minio.setBucketPolicy('logos', JSON.stringify({
      "Id": "PolicyID",
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "Stmt1610823452352355758",
          "Action": [
            "s3:GetObject"
          ],
          "Effect": "Allow",
          "Resource": "arn:aws:s3:::logos/*",
          "Principal": "*"
        }
      ]
    }))
  }
}

class UploadFileUseCase {
  async execute(file) {
    const extension = file.originalname.split('.').pop()
    const fileName = `${uuid()}.${extension}`;

    minio.putObject('logos', fileName, file.buffer);

    return `${config.domain}/logos/${fileName}`;
  }
}

createBucketIfNotExists()

module.exports = UploadFileUseCase;
