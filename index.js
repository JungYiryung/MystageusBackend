const express = require("express") 
const session = require("express-session")
const dotenv = require("dotenv").config() // 미들웨어x 패키지임. 
const app = express()
const logging = require("./src/middleware/logging")

// 마리아디비 여기다가 연결 
// 웹서버 꺼지면 
// 커넥션이 한개라서 동시에 하나만 처리해
// 그래서 동시에 여러개 요청을 처리할 수 있게 만들어준게 connectionpool을 이용해 여러개 요청 처리할 수 잇다. 
app.use(express.json()) 
app.use(session({ // req에 session 추가
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET, // 이거 
    }
))

//로깅 미들웨어 
app.use((req,res, next)=>{
    const originalSend = res.send; // res.send메서드를 originalsend로 보내는것. 
    // express intercepter 구글링 스킬이 되어있다는게 중요해 
    // 남의 코드를 많이 읽자.  
    res.send = (body) =>{ 
        res.body = body
        return originalSend.call(res, body) 
    }
    // if(req.path === "/users/logout" || 
    //     (req.path === "/users" && req.method === "DELETE")) {
    //     res.on("finish", async ()=>{
    //         await logging(req,res,next)
    //         req.session.destroy( (err) => {
    //             if(err) {
    //                 return next(err)
    //             }
    //         })
    //     })
    // }else{
    res.on("finish",()=>{ // 라우터와 응답 사이에 해주는게 res.on 
        logging(req,res,next)
    })
    // }
    next()
})

const authRouter = require("./src/router/auth")
app.use("/auth", authRouter)

const usersRouter = require("./src/router/users")
app.use("/users",usersRouter)

const adminRouter = require("./src/router/admin")
app.use("/admin",adminRouter)

const articlesRouter = require("./src/router/articles")
app.use("/articles", articlesRouter)

const commentsRouter = require("./src/router/comments")
app.use("/comments",commentsRouter)

// 깃허브*****
// app.get("/articles/:idx/detail",(req,res)=>{
//     const articleIdx = req.params.idx
//     const lang = req.query.lang //프론트엔드가 보내주는 값임. uri에 안붙음.

//     const id = req.body.id//프론트엔드가 id라는 키로 값을 넘겨줬을것. 
// })


//notFoundError middleware
app.use((req, res, next)=>{
    const error = new Error("요청하는 라우터가 없습니다. ")
    error.statusCode = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        msg: err.message || '예상못한 에러 발생'
    })
});

app.listen(8000, ()=> {
    console.log("8000번 포트에서 웹 서버 실행")
})//웹서버 열어주는 코드 


