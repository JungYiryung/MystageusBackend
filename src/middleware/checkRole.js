const {user, admin} = require("../const/role.js")
const {noticeBoard, freeBoard} = require("../const/category.js")
const { InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError} = require("../error/customError.js")

const checkRole = async (req, res, next)=>{
    const roleIdx = req.decoded.roleIdx
    const categoryIdx = req.body.categoryIdx
    // 관련없는 코든느 같이 있으면 안돼
    // 테스트하기용이한 코드가 아님. 테스트 용이하게 하기위해 쪼개야해.
    // 일반유저가 공지사항 게시판 쓸 수 없음. 
    // checkRole 에 넣어야함
    if( roleIdx === user && categoryIdx === noticeBoard) {   
        return next(forbiddenError("일반유저는 공지사항 게시판글을 작성할수 없습니다."))
    }

}
module.exports = checkRole