const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const psqlPool = require("../const/postgresql.js")

//좋아요 취소시에는 좋아요가 되어있는 상태만이 취소가 가능하다. 
const checkCommentLike = async (req, res, next)=>{
    const commentIdx = req.params.commentIdx
    const userIdx = req.session.userIdx

    const result = await psqlPool.query("SELECT * FROM project.comment_like WHERE comment_idx = $1 AND user_idx = $2",
        [commentIdx, userIdx])
    if(result.rows.length < 1) {
        return next(NotFoundError("user가 좋아요 한적이 없는 댓글입니다."))
    }
    next()
}

module.exports = checkCommentLike