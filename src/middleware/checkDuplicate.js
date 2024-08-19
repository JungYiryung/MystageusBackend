const psqlPool = require("../const/postgresql.js")
const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")

//중복코드라 함수로 뺌
const selectRows = async (key, req, next)=>{
    const duplicateResult = await psqlPool.query(
        `SELECT * FROM project.users WHERE ${key} = $1`,
        [req.body[key]]
    )
    if(duplicateResult.rows.length>0){
        return next(duplicateError())
    }
    return next()
}

const checkDuplicate = (key) => {
    return async (req, res, next)=>{
        if(!req.decoded) {
             //회원가입의 경우 accessToken미들웨어를 거치지 않고와서 if문으로 걸러줌
            selectRows(key,req,next)
        } else if(req.body[key] === req.decoded[key]) {
            // 닉네임이나 폰번호를 기존 자신의 것에서 변경하지 않은경우
            return next();
        } else{
            // 바꿧는데 다른사람과 겹칠때 중복에러발생시키고 끝 
            selectRows(key,req,next)
            }
        }
       
};

module.exports = checkDuplicate