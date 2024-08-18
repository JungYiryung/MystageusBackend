const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const jwt = require("jsonwebtoken")

const checkAccessToken = (req,res, next)=>{
    try{
        const accessToken = req.headers.authorization
        req.decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SIGNATURE)
        console.log(req.decoded)
        next()
    }catch(err) {
        if(err.message ==="jwt expired") {
            next(unAuthrizeError("access token이 만료되었습니다."))
        } else if(err.message === "invalid signature"){
            next(unAuthrizeError("access token의 signature값이 잘못되었습니다."))
        } else if (err.message === "jwt must be provided") {
            next(unAuthrizeError("access token값이 null 혹은 undefined입니다."))
        } else {
            next(err)
        }
    }
}

module.exports = checkAccessToken