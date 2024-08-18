// 정규표현식모음 
const idRegx = /^[a-zA-Z]{3,20}$/
const passwordRegx = /^[0-9a-zA-Z]{3,20}$/
const nicknameRegx = /^[가-힣]{2,10}$/
const nameRegx = /^[가-힣]{2,5}$/
const phoneRegx = /^010-\d{4}-\d{4}$/
const titleRegx = /^[가-힣]{1,50}$/
const contentRegx = /^[\s\S]+$/
const dateRegx = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/
const idxRegx = /^(?:[1-9]|[1-9]\d|[1-9]\d{2}|1\d{3}|2000)$/


module.exports = { idRegx, passwordRegx, nicknameRegx, nameRegx, phoneRegx, titleRegx, contentRegx,dateRegx, idxRegx }
