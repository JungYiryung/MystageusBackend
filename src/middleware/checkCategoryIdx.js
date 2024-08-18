const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const psqlPool = require("../const/postgresql.js")

//존재하는 cateogyIdx가 아닐때 
const checkCategoryIdx = async (req, res, next)=>{
    const categoryIdx = req.params["categoryIdx"]

    const result = await psqlPool.query("SELECT category_idx FROM project.categorys WHERE category_idx = $1",
        [categoryIdx])
    if(result.rows.length < 1) {
        return next(NotFoundError("유효한 categoryIdx가 아닙니다."))
    }
    next()
}

module.exports = checkCategoryIdx