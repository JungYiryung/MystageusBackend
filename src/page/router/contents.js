const router = require("express").Router()
//api만 적을것임. 
//express의 모든 기능이 필요하지 않아서. router 만 필요해서 임포트함


//GET /articles
router.get("/",(req,res)=>{
    //똑같이 api만들면됨.
})

//GET /articles/:idx/detail 이게 /:idx/detail 2깊이.  
router.get("/:idx/detail",(req,res)=>{
    //똑같이 api만들면됨.
})
// POST /articles
router.post("/",(req, res)=>{

})
// DELETE /articles
router.delete("/",(req,res)=>{

})
// POST /articles/like
router.post("/like",(req, res)=>{
    //js 문법으로 sql
})

