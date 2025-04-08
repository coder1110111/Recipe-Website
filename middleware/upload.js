const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../util/s3');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
});

module.exports = upload;