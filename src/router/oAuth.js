const router = require("express").Router()
const axios = require("axios")
const wrapper = require("../error/wrapper.js")
const querystring = require("querystring")
// router.get("/kakao/callback", (req, res, next) => {
//     res.sendFile(`/Users/jung-yiryung/Desktop/MystageusBackend/src/page/main.html`)
//res.sendFile(`${__dirname}`)
//res.status(200).send("카카오 인증완료, 쿼리값 : " + req.query.code)
// 토큰발급요청 주소
// POST 
// https://kauth.kakao.com/oauth/token
// grant-type = authorization_code
// client_id = 5cc2f65c020d4ed72f3867fa12b00206
// redirect_uri = http://localhost:5000/oauth/kakao/callback
// code = req.query.code
// })

router.get("/kakao/callback",
    wrapper(async (req, res, next) => {
        const token = await axios({
            method: "POST",
            url: "https://kauth.kakao.com/oauth/token",
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            data: querystring.stringify({
                grant_type: "authorization_code",
                client_id: process.env.KAKAO_REST_API_KEY,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code: req.query.code
            })
        })
        const user = await axios({
            methos: "GET",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
                Authorization: `Bearer ${token.data.access_token}`
            }
        })
        res.redirect("http://localhost:5000/main-page")
    })
)

module.exports = router