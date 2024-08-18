const {user, admin} = require("../const/role.js")
const {noticeBoard, freeBoard} = require("../const/category.js")
const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")
const psqlPool = require("../const/postgresql.js")

const checkArticleWriter = async (req,res, next) =>{
    const userIdx = req.decoded.userIdx
    const articleIdx = req.params.articleIdx
    let writerUser
    
    //3계층구조요..? 
    //라우터 내용/ sql 부분 
    // 미들웨어가 많아져 
    // 이걸 어떻게 해결할까? -> 3계층 구조가 나온다. 
    // 분리가 되어야함. 
    // 이 3개를 각각 미들웨어로 나눠야함. 

    //게시글작성글쓴이와 게시글 수정하려는 글쓴이가 다를때 
    if(articleIdx){ 
        writerUser = await psqlPool.query("SELECT user_idx FROM project.articles WHERE article_idx = $1",
        [articleIdx])   
    }
    // 작성한 게시글이나 댓글이 있을때, 작성자와 수정하려는 자가 다를경우
    if(writerUser) {
        writerUserIdx = writerUser.rows[0]["user_idx"]
        if( (writerUserIdx !== undefined) && (userIdx !== writerUserIdx)) {
            return next(forbiddenError("작성자와 같은 userIdx가 아닙니다. 권한이 없습니다."))
        }
    }

    next()
}

module.exports = checkArticleWriter