const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")

const checkRegx = (params) => { // 
    return (req,res,next)=>{
        for(const param of params) {
            
            const [ arguValueName , arguRegx , arguWay ] = param
            const value = req[arguWay][arguValueName]
            const regx = arguRegx
            console.log("req" , req.body)
            console.log(req.body.request)
            console.log("param" , param)
            console.log("value" , value)
            console.log("regx", regx)
            if(value === undefined){
                return next(InvalidRegxError("값 undefined 임. 안보내줌"))
            }
            if(!regx.test(value)){
                return next(InvalidRegxError())    
            }
        }
            next()
        }
    };



module.exports = checkRegx


