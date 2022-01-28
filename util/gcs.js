const util = require('util');
const { v4: uuidv4 } = require('uuid');
const {storage, bucket} = require('../config.js');

const { format } = util;

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to storage bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadFile = (file, path) => new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    /**
     * Rename File to include a random unique identifier 
     * to avoid writing on same object and replace spaces 
     * with underscore (no one loves a space in file name 
     * and it would cause troubles later!)
     */

    const filePath = path == null ? `${uuidv4()}_${originalname}` :  `${path}/${uuidv4()}_${originalname}`
    const blob = bucket.file(filePath.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
        resumable: false
    });

    blobStream.on('finish', () => {
        /**
         * Construct Public URL (Bucket must have public 
         * permission or this won't work)
         */
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
    })
    .on('error', () => {
        reject(`Unable to upload file, something went wrong.`)
    })
    .end(buffer);
});

/**
 *
 * @param { fileName } string file object that will be deleted
 * @description - This function does the following
 * - It deletes a file from storage bucket on Google Cloud
 */
const deleteFile = async (fileName) => {
    await storage.bucket(bucket.name).file(fileName).delete();
}

module.exports = {uploadFile, deleteFile};