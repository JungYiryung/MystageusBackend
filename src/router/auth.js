// refresh 토큰을 통해 access token 재발급 받고 싶을때 프론트엔드에서 요청하는 api 
// refresh token 없을경우 token 이 아예없다. 
// refresh token 유효하면 access token 새로 발급
// refresh token 만료기간 지났으면 만료기간 지났으니 새로 로그인해라. 

const router = require("express").Router()
const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()

router.post("/refreshToken", (req,res,next) =>{
    try{
        const refreshToken = req.body.refreshToken
        const result = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SIGNATURE)
        const accessToken = jwt.sign({
            "userIdx" : result.userIdx,
            "roleIdx" : result.roleIdx,
            "nickname": result.nickname,
            "phone" : result.phone
        },process.env.ACCESS_TOKEN_SIGNATURE, {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        })
        return res.status(200).send({
            "new access token" :  accessToken,
        })

    }
    catch(err) {
        if(err.message ==="jwt expired") {
            return next(unAuthrizeError("refresh token이 만료되었습니다. 다시 로그인하세요"))
        } else if(err.message === "invalid signature"){
            return next(unAuthrizeError("refresh token의 signature값이 잘못되었습니다."))
        } else if (err.message === "jwt must be provided") {
            return next(unAuthrizeError("refresh token값이 null 혹은 undefined입니다."))
        } else {
            return next(err)
        }
    }})

module.exports = router
