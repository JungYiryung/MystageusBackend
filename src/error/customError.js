function InvalidRegxError(msg = "정규표현식에러") {
    const error = new Error(msg)
    error.statusCode = 400
    return error
}
function unAuthrizeError(msg = "회원인증되지 않았음"){
    const error = new Error(msg)
    error.statusCode = 401
    return error
}
function forbiddenError(msg="권한이 없음"){
    const error = new Error(msg)
    error.statusCode = 403
    return error
}
function NotFoundError(msg = "유효한 데이터를 찾을수 없"){
    const error = new Error(msg)
    error.statusCode = 404
    return error
}
function duplicateError(msg = "중복되었음") {
    const error = new Error(msg)
    error.statusCode = 409
    return error
}

module.exports = {
    InvalidRegxError, unAuthrizeError, forbiddenError, NotFoundError, duplicateError
}