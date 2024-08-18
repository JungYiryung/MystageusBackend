const psqlPool = require("../const/postgresql.js")
const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")


const checkDuplicate = (key) => {
    return async (req, res, next)=>{
        // req.session[key] 는 본래 설정되있던 값
        // req.body[key]는 새로 보내준 값
        // 닉네임이나 폰번호를 안바꿨을때 
        if(req.body[key] === req.decoded[key]) {
            return next();
        } else{
            // 바꿧는데 다른사람과 겹칠때 중복에러발생시키고 끝 
            const duplicateResult = await psqlPool.query(
                `SELECT * FROM project.users WHERE ${key} = $1`,
                [req.body[key]]
            )
            if(duplicateResult.rows.length>0){
                return next(duplicateError())
            }
            return next()
        }
    }
};

module.exports = checkDuplicate