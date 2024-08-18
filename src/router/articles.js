const router = require("express").Router()
const {idRegx, passwordRegx, nicknameRegx, nameRegx, phoneRegx, titleRegx, contentRegx, dateRegx,idxRegx } = require("../const/regx.js")
const psqlPool = require("../const/postgresql.js")
const checkRegx = require("../middleware/checkRegx.js")
const wrapper = require("../error/wrapper.js")
const checkArticleIdx = require("../middleware/checkArticleIdx.js")
const checkArticleLike = require("../middleware/checkArticleLike.js")
const checkCategoryIdx = require("../middleware/checkCategoryIdx.js")
const checkAccessToken = require("../middleware/checkAccessToken.js")
const checkRole = require("../middleware/checkRole.js")
const checkArticleWriter = require("../middleware/checkArticleWriter.js") 
const uploadFile = require("../middleware/uploadFile.js")

// 게시글 쓰기
router.post("/",checkAccessToken, uploadFile.single('image'), checkRegx( [ ["title",titleRegx,"body"],
    ["contents",contentRegx,"body"],["categoryIdx",idxRegx,"body"] ] ),
    checkRole,
    wrapper ( async (req, res, next)=>{
    const tokenUserIdx = req.decoded.userIdx      
 
    const title = req.body.title;
    const contents = req.body.contents;
    const categoryIdx = req.body.categoryIdx; 

    await psqlPool.query(
        "INSERT INTO project.articles ( title, contents, user_idx, category_idx) VALUES ($1,$2,$3,$4);",
        [title, contents, tokenUserIdx, categoryIdx]
    )
    res.status(200).send()
    })
)

// 이미지 파일 업로드
router.post('/test/img', uploadFile.single('image'),
    wrapper( async (req, res,next)=>{
    res.send("성공")})
)


//특정게시판의 특정게시물읽기
router.get("/:articleIdx/detail", checkAccessToken , checkRegx([["articleIdx",idxRegx,"params"]]),
    checkArticleIdx,
    wrapper(async (req,res,next)=>{
        const articleIdx = req.params["articleIdx"]
    
        await psqlPool.query("BEGIN")
        await psqlPool.query("UPDATE project.articles SET view_count = view_count + 1 WHERE article_idx = $1",
            [articleIdx]
        )
        const result = await psqlPool.query("SELECT * FROM project.articles JOIN project.categorys ON project.articles.category_idx = project.categorys.category_idx WHERE article_idx = $1",
            [articleIdx])
        await psqlPool.query("COMMIT")

        const rows = result.rows
        res.status(200).send({
            "userIdx" : rows[0]["user_idx"],
            "categoryName" : rows[0]["category_title"],
            "title" : rows[0]["title"],
            "contents" : rows[0]["contents"],
            "viewCount" : rows[0]["view_count"],
            "likeCount" : rows[0]["like_count"]
        })
}))

//게시글 수정
router.put("/:articleIdx/detail", checkAccessToken ,checkRegx([["title",titleRegx,"body"],
    ["contents",contentRegx,"body"],["articleIdx",idxRegx,"params"]]),
    checkArticleWriter,
    checkArticleIdx,
    wrapper(async(req,res, next)=>{

    const articleIdx = req.params["articleIdx"]
    const title = req.body.title
    const contents = req.body.contents
    
    await psqlPool.query("UPDATE project.articles SET title = $1, contents = $2 WHERE article_idx = $3",
        [title,contents,articleIdx])    
    res.status(200).send()
    })
)
    
//게시글 삭제
router.delete("/:articleIdx/detail", checkAccessToken , checkRegx([["articleIdx",idxRegx,"params"]]),
    checkArticleWriter,
    checkArticleIdx,
    wrapper( async(req,res,next)=>{
    const articleIdx = req.params["articleIdx"]

    await psqlPool.query("DELETE FROM project.articles WHERE article_idx = $1 ", [articleIdx])   
    res.status(200).send()
    })
)

//게시글 좋아요 눌렀을 때 
router.post("/:articleIdx/like", checkAccessToken, checkRegx([["articleIdx",idxRegx,"params"]]),
    checkArticleIdx,
    wrapper( async (req, res, next)=>{
    const articleIdx = req.params["articleIdx"]
    const userIdx = req.decoded.userIdx

    await psqlPool.query("BEGIN")
    await psqlPool.query("UPDATE project.articles SET like_count = like_count + 1 WHERE article_idx = $1",
        [articleIdx]
    )
    await psqlPool.query("INSERT INTO project.article_like (user_idx, article_idx) VALUES ($1, $2)",
        [userIdx, articleIdx]
    )
    await psqlPool.query("COMMIT")

    res.status(200).send()
}))

//게시글 좋아요 취소시
router.delete("/:articleIdx/like",checkAccessToken, checkRegx([["articleIdx",idxRegx,"params"]]),
    checkArticleIdx,
    checkArticleLike,
    wrapper( async (req,res,next)=>{
    const articleIdx = req.params["articleIdx"]

    await psqlPool.query("BEGIN")
    await psqlPool.query("UPDATE project.articles SET like_count = like_count - 1 WHERE article_idx = $1",
        [articleIdx]
    )
    await psqlPool.query("DELETE FROM project.article_like WHERE article_idx = $1",
        [articleIdx]
    )
    await psqlPool.query("COMMIT")

    res.status(200).send()
}))

//특정게시판당 게시글 목록보기 
router.get("/list/categorys/:categoryIdx", checkAccessToken, checkRegx([["categoryIdx",idxRegx,"params"]]), 
    checkCategoryIdx,
    wrapper( async (req,res,next)=>{
    const categoryIdx = req.params.categoryIdx;
    const result = await psqlPool.query("SELECT * FROM project.articles WHERE category_idx = $1",
        [categoryIdx])
    res.status(200).send(result.rows);
}))

//게시판 목록 
router.get("/", checkAccessToken, 
    wrapper(async (req, res, next)=>{
    const result = await psqlPool.query("SELECT category_title FROM project.categorys")
    res.status(200).send(result.rows)
}))


module.exports = router;

