require('dotenv').config();
const GCS = require('@google-cloud/storage');
const path = require('path');

const keyFilename = path.join(__dirname, 'key.json');
const bucketName = process.env.BUCKET_NAME;
const projectId = process.env.PROJECT_ID;

const { Storage } = GCS;

const storage = new Storage({
    keyFilename,
    projectId,
});

const bucket = storage.bucket(bucketName);

module.exports = {storage, bucket};