const router = require("express").Router()
const {idRegx, passwordRegx, nicknameRegx, nameRegx, phoneRegx, titleRegx, contentRegx, dateRegx,idxRegx } = require("../const/regx.js")
const psqlPool = require("../const/postgresql.js")
const checkRegx = require("../middleware/checkRegx.js")
const wrapper = require("../error/wrapper.js")
const checkArticleIdx = require("../middleware/checkArticleIdx.js")
const checkCommentIdx = require("../middleware/checkCommentIdx.js")
const checkCommentLike = require("../middleware/checkCommentLike.js")
const checkCommentWriter = require("../middleware/checkCommentWriter.js")
const checkAccessToken = require("../middleware/checkAccessToken.js")

// 댓글 쓰기
router.post("/:articleIdx",checkAccessToken, checkRegx([ ["articleIdx",idxRegx,"params"], ["contents",contentRegx,"body"] ]),
    checkArticleIdx,
    wrapper( async (req,res, next)=>{
    const userIdx = req.decoded.userIdx 
    const articleIdx = req.params.articleIdx
    const contents = req.body.contents
    await psqlPool.query(
        "INSERT INTO project.comments (article_idx, user_idx, comment_contents) VALUES ($1, $2, $3)",
        [articleIdx, userIdx, contents]
    )
    res.status(200).send()
}))

//댓글 읽기
router.get("/:articleIdx",checkAccessToken, checkRegx([["articleIdx",idxRegx,"params"]]),
    checkArticleIdx,
    wrapper( async (req,res,next)=>{
    const articleIdx = req.params.articleIdx
    const result = await psqlPool.query(
        "SELECT * FROM project.comments WHERE article_idx = $1",
        [articleIdx]
    )
    res.status(200).send(result.rows)
}))

//댓글 수정
router.put("/:commentIdx",checkAccessToken, checkRegx([["commentIdx",idxRegx,"params"]]),
    checkCommentWriter,
    checkCommentIdx,
    wrapper(async (req,res, next)=>{
    const commentIdx = req.params.commentIdx;
    const comments = req.body.comments;
    await psqlPool.query("UPDATE project.comments SET comment_contents = $1 WHERE comment_idx = $2",
        [comments, commentIdx])    

    res.status(200).send()
}))

//댓글 삭제
router.delete("/:commentIdx",checkAccessToken, checkRegx([["commentIdx",idxRegx,"params"]]),
    checkCommentWriter,
    checkCommentIdx,
    wrapper (async (req,res)=>{
    const commentIdx = req.params.commentIdx

    await psqlPool.query("DELETE FROM project.commnets WHERE comment_idx = $1 ", [commentIdx])   
    res.status(200).send()
}))

//댓글 좋아요 눌렀을 때
router.put("/:commentIdx/like",
    checkAccessToken, 
    checkRegx([["commentIdx",idxRegx,"params"]]),
    checkCommentIdx,
    wrapper(async (req,res,next)=>{
    const commentIdx = req.params.commentIdx
    const userIdx = req.decoded.userIdx
    await psqlPool.query("BEGIN")
    await psqlPool.query("UPDATE project.comments SET like_count = like_count + 1 WHERE comment_idx = $1",
        [commentIdx]
    )
    await psqlPool.query("INSERT INTO project.comment_like (user_idx, comment_idx) VALUES ($1, $2)",
        [userIdx, commentIdx]
    )
    await psqlPool.query("COMMIT")

    res.status(200).send()
}))

//댓글 좋아요 취소시
router.delete("/:articleIdx/like",checkAccessToken, 
    checkRegx([["commentIdx",idxRegx,"params"]]),
    checkCommentIdx,
    checkCommentLike,
    wrapper (async (req,res,next)=>{
    const commentIdx = req.params.commentIdx

    await psqlPool.query("BEGIN")
    await psqlPool.query("UPDATE project.comments SET like_count = like_count - 1 WHERE comment_idx = $1",
        [commentIdx]
    )
    await psqlPool.query("DELETE FROM project.comment_like WHERE comment_idx = $1",
        [commentIdx]
    )
    await psqlPool.query("COMMIT")

    res.status(200).send()
}))

module.exports = router;