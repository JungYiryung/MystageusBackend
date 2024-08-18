const wrapper = fn =>{ // 비동기 함수를 인자로 받음. 
    return (async(req,res,next) =>{
        try{
            return await fn(req, res, next)
        }catch(err){
            return next(err)
        }
    })
}

module.exports = wrapper