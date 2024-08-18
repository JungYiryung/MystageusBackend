const router = require("express").Router()
const {idRegx, passwordRegx, nicknameRegx, nameRegx, phoneRegx, titleRegx, dateRegx,idxRegx } = require("../const/regx.js")
const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const psqlPool = require("../const/postgresql.js")
const checkRegx = require("../middleware/checkRegx.js")
const checkDuplicate = require("../middleware/checkDuplicate.js")
const checkAccessToken = require("../middleware/checkAccessToken.js")
const wrapper = require("../error/wrapper.js")
const jwt = require("jsonwebtoken")
// 201 json({success }) 쓰는 이유 찾아오쟈. 

// webhacking막으려고 
// httponly http요청말고는 쿠키
// csrf 해킹기법 xss 도 같이 찾아봐 
// 웹해킹 기법들도 알고있어야함. 
// secrete는 16자리 24자리 30자리 적당히... 

// 간단한 예외처리 원했음. 
// if(accountIdx) {
//    res.send("로그인후 이용해주라~") 
// }
// 예외처리 해줘 
// 
// 포스트맨 변수기능 에 8000까지 저장해놓는거 추천. 
// 포스트맨 사용법 더 자세히 찾아보기 /

//로그인기능
// POST /users/login
// router.post('/login',(req,res,next)=>{
//     console.log("지나가는 곳")
//     throw new Error("그냥 한번 내보는 에러")
//     next()
// })
router.post("/login", // 2차원배열로 받던가, 직관적으로 두개의 인자로 전달해주던가.
    checkRegx([ ["id",idRegx,"body"] , ["password",passwordRegx,"body"] ]),
    wrapper(async (req, res, next) => {
        const userId = req.body.id
        const userPassword = req.body.password
        
        const loginResult = 
            await psqlPool.query(
                "SELECT * FROM project.users WHERE id = $1 AND password = $2",
                [userId, userPassword]
            )
        const loginRows = loginResult.rows
        if(loginRows.length < 1) {
            throw NotFoundError() 
        }
        
        const accessToken = jwt.sign({
            "userIdx" : loginResult.rows[0].user_idx,
            "roleIdx" : loginResult.rows[0].role_idx,
            "nickname": loginResult.rows[0].nickname,
            "phone" : loginResult.rows[0].phone
        },process.env.ACCESS_TOKEN_SIGNATURE, {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        })
        const refreshToken = jwt.sign({
            "userIdx" : loginResult.rows[0].user_idx,
            "roleIdx" : loginResult.rows[0].role_idx,
            "nickname": loginResult.rows[0].nickname,
            "phone" : loginResult.rows[0].phone
        },process.env.REFRESH_TOKEN_SIGNATURE,{
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        })

        res.status(200).send({
            "access token" :  accessToken,
            "refresh token" : refreshToken
        })
    })
)

//로그아웃 기능
//session.destroy하기..
// 토큰쓰면 로그아웃 없어야함

// router.delete("/logout",checkLogin, 
//     (req,res,next)=>{
//     res.status(200).send()    
// })

//회원가입기능
router.post("/", checkRegx( [ ["id",idRegx,"body"], ["password",passwordRegx,"body"],
    ["nickname",nicknameRegx,"body"], ["name",nameRegx,"body"] , ["phone",phoneRegx,"body"] ]),
    checkDuplicate("id"),
    checkDuplicate("nickname"),
    checkDuplicate("phone") ,
    wrapper( async(req, res, next) => {
        const userId = req.body.id
        const userPassword = req.body.password
        const userNickname = req.body.nickname
        const userName = req.body.name
        const userPhone = req.body.phone
        const userRoleIdx = req.body.roleIdx

        await psqlPool.query(
            "INSERT INTO project.users (id, password , nickname , name , phone, role_idx) VALUES($1,$2,$3,$4,$5,$6);",
            [userId, userPassword, userNickname, userName, userPhone, userRoleIdx] 
        )
        res.status(200).send()
    })
)


//아이디찾기
router.get("/id", checkRegx([ ["name",nameRegx,"body"] , ["phone",phoneRegx,"body"] ]), 
    wrapper ( async (req, res, next) => {
        const userName = req.body.name
        const userPhone = req.body.phone

        const result = await psqlPool.query(
            "SELECT id FROM project.users WHERE name=$1 AND phone = $2",
            [userName, userPhone] 
        )

        if(result.rows.length === 0) {
            return next(NotFoundError());
        }
        res.status(200).json({
            "id" : result.rows[0].id
        })
    })
)

//비밀번호찾기
router.get("/pw", 
    checkRegx([["id",idRegx,"body"],["name",nameRegx,"body"], ["phone",phoneRegx,"body"]]),
    wrapper( async (req, res, next) => {
        const userId = req.body.id
        const userName = req.body.name
        const userPhone = req.body.phone
        
        const result = await psqlPool.query(
            "SELECT password FROM project.users WHERE id=$1 AND name=$2 AND phone = $3",
            [userId, userName, userPhone] 
        )
        if(result.rows.length === 0) {
            return next(NotFoundError());
        }
        res.status(200).json({
            "password" : result.rows[0].password
        })
        })
)

//내정보 보기
router.get("/my", checkAccessToken , 
    wrapper( async (req, res, next) => {
        const tokenUserIdx = req.decoded.userIdx   
        const result = await psqlPool.query(
            "SELECT * FROM project.users WHERE user_idx=$1",
            [tokenUserIdx] 
        )
        res.status(200).json({
            "id" : result.rows[0].id, 
            "password" : result.rows[0].password,
            "nickname" : result.rows[0].nickname,
            "name" : result.rows[0].name,
            "phone" : result.rows[0].phone  
        })
    }
))

//내정보 수정
router.put("/my", checkAccessToken, 
    checkRegx([ ["password",passwordRegx,"body"],["nickname",nicknameRegx,"body"],
    ["name",nameRegx,"body"], ["phone",phoneRegx,"body"] ]),
    checkDuplicate("nickname"),
    checkDuplicate("phone"),
    wrapper( async (req, res, next) => {
    const tokenUserIdx = req.decoded.userIdx  

    const userPassword = req.body.password
    const userNickname = req.body.nickname
    const userName = req.body.name
    const userPhone = req.body.phone

    const result = await psqlPool.query(
        "UPDATE project.users SET password=$1, nickname=$2, name=$3, phone=$4 WHERE user_idx=$5;",
        [userPassword, userNickname, userName, userPhone, tokenUserIdx] 
    )
    res.status(200).send()
    })
)
//회원탈퇴
// 세션삭제도 들어가야함. 그래야 개발실수 덜수있음. 
router.delete("/", checkAccessToken, 
    wrapper ( async (req, res, next) => {
        const tokenUserIdx = req.decoded.userIdx  
        await psqlPool.query(
            "DELETE FROM project.users WHERE user_idx=$1;",
            [tokenUserIdx] 
        )
        res.status(200).send()
    })
)

module.exports = router;
