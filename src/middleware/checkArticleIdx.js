const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const psqlPool = require("../const/postgresql.js")

//존재하는 articleIdx가 아닐때 
const checkArticleIdx = async (req, res, next)=>{
    const articleIdx = req.params["articleIdx"]

    const result = await psqlPool.query("SELECT article_idx FROM project.articles WHERE article_idx = $1",
        [articleIdx])
    if(result.rows.length < 1) {
        return next(NotFoundError("유효한 articleIdx가 아닙니다."))
    }
    next()
}

module.exports = checkArticleIdx