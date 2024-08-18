const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const psqlPool = require("../const/postgresql.js")

//좋아요 취소시에는 좋아요가 되어있는 상태만이 취소가 가능하다. 
const checkPostLike = async (req, res, next)=>{
    const articleIdx = req.params["articleIdx"]
    const userIdx = req.session.userIdx

    const result = await psqlPool.query("SELECT * FROM project.article_like WHERE article_idx = $1 AND user_idx = $2",
        [articleIdx, userIdx])
    if(result.rows.length < 1) {
        return next(NotFoundError("user가 좋아요 한적이 없는 게시물입니다."))
    }
    next()
}

module.exports = checkPostLike