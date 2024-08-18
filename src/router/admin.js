const router =  require("express").Router()
const {idRegx, passwordRegx, nicknameRegx, nameRegx, phoneRegx, titleRegx, contentRegx, dateRegx,idxRegx } = require("../const/regx.js")
const psqlPool = require("../const/postgresql.js")
const checkRegx = require("../middleware/checkRegx.js")
const wrapper = require("../error/wrapper.js")
const checkAdmin = require("../middleware/checkAdmin.js")
const checkAccessToken = require("../middleware/checkAccessToken.js")
//카테고리 추가
router.post("/",checkAccessToken, checkRegx( [ ["categoryTitle",titleRegx,"body"] ]),
    checkAdmin,
    wrapper ( async (req, res, next)=>{   
    const categoryTitle = req.body.categoryTitle; 

    await psqlPool.query(
        "INSERT INTO project.categorys ( category_title ) VALUES ($1);",
        [categoryTitle]
    ) 
    res.status(200).send()
    })
)
//카테고리 수정
router.put("/:categoryIdx",checkAccessToken, checkRegx([["categoryIdx",idxRegx,"params"], ["categoryTitle",titleRegx,"body"]]),
    checkAdmin,
    wrapper(async (req,res, next)=>{
    const categoryIdx = req.params.categoryIdx
    const categoryTitle = req.body.categoryTitle 

    await psqlPool.query("UPDATE project.categorys SET category_title = $1 WHERE category_idx = $2",
        [categoryTitle, categoryIdx])    

    res.status(200).send()
}))

//카테고리 삭제
router.delete("/:categoryIdx",checkAccessToken, checkRegx([["categoryIdx",idxRegx,"params"]]),
    checkAdmin,
    wrapper(async (req,res)=>{
    const categoryIdx = req.params.categoryIdx

    await psqlPool.query("DELETE FROM project.categorys WHERE category_idx = $1 ", [categoryIdx])   
    res.status(200).send()
}))

module.exports = router