const express = require('express');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const multer = require('multer');
const {uploadFile, deleteFile} = require('./util/gcs');

require('dotenv').config();

const port = process.env.PORT || 8080;

const app = express();
const fileSizeLimit = process.env.FILE_LIMIT || 5;

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: fileSizeLimit * 1024 * 1024,
    },
});

const username = process.env.APP_USER;
const password = process.env.APP_SECRET;
const users = {};
users[username] = password;

app.use(basicAuth({
    users,
    challenge: false,
    unauthorizedResponse: {
        message: 'Bad credentials',
    },
}));

app.disable('x-powered-by');
app.use(multerMid.single('file'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.post('/upload', async (req, res, next) => {
    try {
        const myFile = req.file;
        const path = req.body.path
        const fileUrl = await uploadFile(myFile, path)
        res
            .status(200)
            .json({
                message: "File uploaded successfully",
                url: fileUrl
            })
    } catch (error) {
        next(error)
    }
});

app.delete('/delete/:fileName', async (req, res, next) => {
    try {
        const fileName = await deleteFile(req.params.fileName)
        res
            .status(200)
            .json({
                message: "File deleted successfully",
                fileName: req.params.fileName
            })
    } catch (error) {
        next(error)
    }
});

app.use((err, req, res, next) => {
    res.status(500).json({
        error: err,
        message: 'Internal server error!',
    })
    next();
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});