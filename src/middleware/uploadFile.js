const AWS = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
const path = require("path")

const extensions = ['.png','.jpg','.jpeg','.bmp','.gif']

// const s3 = new AWS.S3({
//     region: process.env.AWS_S3_REGION,
//     accessKeyId : process.env.AWS_ACCESS_KEY,
//     secretAccessKey : process.env.AWS_SECRETE_ACCESS_KEY 
// })

AWS.config.update({
    region: process.env.AWS_S3_REGION,
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRETE_ACCESS_KEY 
})

const s3 = new AWS.S3()

const uploadFile = multer({
    storage : multerS3({
        s3 : s3,
        bucket :  process.env.AWS_S3_BUCKET_NAME,
        key : function (req, file, cb) {
            try{
            const fileExtension = path.extname(file.originalname)
            if(!extensions.includes(fileExtension)) {
                return cb(new Error("이미지파일 아님"))
            }
            cb(null, Date.now().toString())
            } catch{
                return cb(new Error("이미지 업로드 에러"))
            }
        },
        acl : 'public-read-write'
    }),
    filter
})

module.exports = uploadFile