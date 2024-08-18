const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const psqlPool = require("../const/postgresql.js")

//존재하는 commentIdx가 아닐때 
const checkCommentIdx = async (req, res, next)=>{
    const commentIdx = req.params.commentIdx

    const result = await psqlPool.query("SELECT comment_idx FROM project.comments WHERE comment_idx = $1",
        [commentIdx])
    if(result.rows.length < 1) {
        return next(NotFoundError("유효한 commentIdx가 아닙니다."))
    }
    next()
}

module.exports = checkCommentIdx